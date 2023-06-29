UK_ROOT ?= $(PWD)/.unikraft/unikraft
UK_LIBS ?= $(PWD)/.unikraft/libs

# TODO: find and add extra libs to make your code compile
LIBS := $(UK_LIBS)/musl:$(UK_LIBS)/lwip

all:
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
