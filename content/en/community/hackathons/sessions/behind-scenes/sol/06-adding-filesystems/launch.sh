#!/bin/bash

if test $# -ne 1; then
    echo "Usage: $0 <kvm_image>" 1>&2
    exit 1
fi

kvm_image="$1"
fs_tag="fs0"
local_fs_dir="./guest_fs/"

echo "Starting KVM image $kvm_image mounting "$local_fs_dir" ..."
sudo qemu-system-x86_64  -fsdev local,id=myid,path=$(pwd)/"$local_fs_dir",security_model=none \
    -device virtio-9p-pci,fsdev=myid,mount_tag="$fs_tag",disable-modern=on,disable-legacy=off \
    -kernel "$kvm_image" \
    -cpu host \
    -enable-kvm \
    -nographic
