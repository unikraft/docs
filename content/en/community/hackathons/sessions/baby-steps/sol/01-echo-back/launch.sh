#!/bin/bash

if test $# -ne 1; then
    echo "Usage: $0 <path_to_kvm_image>" 1>&2
    exit 1
fi

KVM_IMAGE="$1"
BRIDGE_IFACE="virbr0"
BRIDGE_IP="172.44.0.1"
VM_IP="172.44.0.2"

echo "Creating bridge $BRIDGE_IFACE with IP address $BRIDGE_IP ..."
sudo brctl addbr "$BRIDGE_IFACE" || true
sudo ifconfig "$BRIDGE_IFACE" "$BRIDGE_IP"


# TODO bonus: add a filesystem
fs_tag="fs0"
local_fs_dir="./guest_fs/"

echo "Starting KVM image connected to bridge interface $BRIDGE_IFACE ..."
sudo /usr/bin/qemu-system-x86_64 -netdev bridge,id=en0,br=virbr0 \
                        -device virtio-net-pci,netdev=en0 \
                        -fsdev local,id=myid,path=$(pwd)/"$local_fs_dir",security_model=none \
    			        -device virtio-9p-pci,fsdev=myid,mount_tag="$fs_tag",disable-modern=on,disable-legacy=off \
                        -kernel "$KVM_IMAGE" \
                        -append "netdev.ipv4_addr=$VM_IP netdev.ipv4_gw_addr=$BRIDGE_IP netdev.ipv4_subnet_mask=255.255.255.0 --" \
                        -cpu host \
                        -enable-kvm \
                        -nographic
