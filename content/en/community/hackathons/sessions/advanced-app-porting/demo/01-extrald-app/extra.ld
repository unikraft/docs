SECTIONS
{
	.my_section : {
    	PROVIDE(my_section_start = .);
     	KEEP (*(.my_section_entry))
     	PROVIDE(my_section_end = .);
	}
}
INSERT AFTER .text;
