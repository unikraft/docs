SECTIONS
{
        .uk_lib_inittab : {
                PROVIDE(_uk_lib_inittab_start = .);
                KEEP (*(.uk_lib_inittab0))
                KEEP (*(.uk_lib_inittab0.*))
                KEEP (*(.uk_lib_inittab1))
                KEEP (*(.uk_lib_inittab1.*))
                PROVIDE(_uk_lib_inittab_end = .);
        }
}
INSERT AFTER .text;
