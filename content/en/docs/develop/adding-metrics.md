---
title: Adding Metrics
date: 2020-01-11T14:09:21+09:00
draft: true
weight: 512
---

## Adding Metrics to Unikraft

Metrics are important for Unikraft as much as any other system.
They offer a way to measure the performance of the system and to understand its behaviour.
Currently, Unikraft has a low amount of monitored parts of the system, and could use more additions.
Adding metrics to Unikraft is a simple process, and it is done in a similar fashion to any other feature addition.

The process of adding metrics is outlined in chapters below:

### Identifying Valid Metrics

The first, and most important, step is to identify the metrics you want to add.
Unikraft follows the [ProcFS](https://man7.org/linux/man-pages/man5/proc.5.html) model for information about the system.
As such, to easily find a metric that is needed, we can look inside `/proc/` and identify the missing metrics from Unikraft.
Once identified, we look inside Unikraft to find the corresponding Unikraft component.
Keep in mind that most components inside Unikraft can be turned on and off.
This means that our metrics should reside in the component that we monitor.

Below we will follow the [instrumentation](https://github.com/unikraft/unikraft/pull/226/commits) for the `uknetdev` internal library:

### Registering Metrics

Registering metrics inside Unikraft means first adding a new entry inside `Config.uk`. This enables users to turn the metrics on and off.

```kconfig
	config LIBUKNETDEV_METRICS
		bool "Interface metrics for statistics"
		default n
		help
			The metrics instrumented are the same with the ones from
			/proc/net/dev. The metrics are per interface.
```

With this done, we can then enclose all the code we add in between `#ifdef`s and `#endif`s.

```c
#ifdef CONFIG_LIBUKNETDEV_METRICS
// Your code here
#endif /* CONFIG_LIBUKNETDEV_METRICS */
```

With this done we can start writing our code.

### Creating Metrics

Creating metrics is a 3 step process:
 1. Creating the metric structure;
 2. Adding the metrics to an already existing component; and,
 3. Modifing the metrics inside the component;

For the first step we create the structs with data identified earlier:

```c
struct uk_netdev_tx_metrics {
	// Fields
};

struct uk_netdev_rx_metrics {
	// Fields
};

struct uk_netdev_metrics {
	struct uk_netdev_tx_metrics tx_m;
	struct uk_netdev_rx_metrics rx_m;
};
```

For the second step, we add them to the existing structure: 

```c
struct uk_netdev {
	// Existing Fields

#ifdef CONFIG_LIBUKNETDEV_METRICS
	// Lock
	spinlock_t metrics_lock;
#endif /* CONFIG_LIBUKNETDEV_METRICS */
};
```

Finally, the most important step, is to increase and decrease our counters.
In the case of the `uknetdev` metrics, we track network packet behaviour:

```c
#ifdef CONFIG_LIBUKNETDEV_METRICS
	if (ret >= 0 && (ret & UK_NETDEV_STATUS_SUCCESS)) {
		ukarch_spin_lock(&dev->metrics_lock);
		dev->metrics.rx_m.bytes += (*pkt)->len;
		dev->metrics.rx_m.packets++;
		ukarch_spin_unlock(&dev->metrics_lock);
		return ret;
	}
    // All other fields
#endif /* CONFIG_LIBUKNETDEV_METRICS */
```

Our structure now contains all the data about network interfaces.

### Exposing Metrics

The final part of our implementation is to expose our metrics to make them accessible.
This means just adding a getter to the metrics inside the component:

```c
#ifdef CONFIG_LIBUKNETDEV_METRICS
int uk_netdev_metrics_get(struct uk_netdev *dev,
			struct uk_netdev_metrics *dev_metrics)
{
	UK_ASSERT(dev);
	UK_ASSERT(dev_metrics);

	ukarch_spin_lock(&dev->metrics_lock);
	memcpy(dev_metrics, &dev->metrics, sizeof(*dev_metrics));
	ukarch_spin_unlock(&dev->metrics_lock);

	return 0;
}
#endif /* CONFIG_LIBUKNETDEV_METRICS */
```

And the function to the exported symbols file `exportsyms.uk`:

```text
uk_netdev_metrics_get
```

With all the steps done, we can call the getter and access the metrics.
