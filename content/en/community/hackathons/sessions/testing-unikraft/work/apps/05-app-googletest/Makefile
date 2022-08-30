UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
LIBS := $(UK_LIBS)/lib-compiler-rt:$(UK_LIBS)/lib-libunwind:$(UK_LIBS)/lib-libcxxabi:$(UK_LIBS)/lib-libcxx:$(UK_LIBS)/lib-newlib:$(UK_LIBS)/lib-googletest

all:
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
