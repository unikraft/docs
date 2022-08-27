#!/bin/bash

if test $# -ne 1; then
    echo "Usage: $0 <kvm_image>" 1>&2
    exit 1
fi

kvm_image="$1"
bridge_iface="virbr0"
bridge_ip="172.44.0.1"
vm_ip="172.44.0.2"

echo "Creating bridge $bridge_iface with IP address $bridge_ip ..."
sudo brctl addbr "$bridge_iface" || true
sudo ifconfig "$bridge_iface" "$bridge_ip"

echo "Starting KVM image connected to bridge interface $bridge_iface ..."
sudo qemu-system-x86_64  -fsdev local,id=myid,path=$(pwd)/fs0,security_model=none \
                         -device virtio-9p-pci,fsdev=myid,mount_tag=rootfs,disable-modern=on,disable-legacy=off \
                         -netdev bridge,id=en0,br=virbr0 \
                         -device virtio-net-pci,netdev=en0 \
                         -kernel "$kvm_image" \
                         -append "netdev.ipv4_addr=172.44.0.2 netdev.ipv4_gw_addr=172.44.0.1 netdev.ipv4_subnet_mask=255.255.255.0 --" \
                         -cpu host \
                         -enable-kvm \
                         -nographic
