#!/usr/bin/env python3

import sys
import re
import os


STATE_BEGIN = 0
STATE_DOUBLE = 1
STATE_TRIPLE = 2
STATE_NORMAL = 3
STATE_END = 4

toc = ""


def write_to_file(fname, content):
    global toc

    f = open(os.path.join("content", fname), "wt")
    f.write(content)
    f.close()

    folder_name = os.path.basename(os.getcwd())
    toc += "{{{{< readfile file=\"/community/hackathons/sessions/{}/content/{}\" markdown=\"true\" >}}}}\n".format(folder_name, fname)


def split_file(fname):
    global toc

    state = STATE_BEGIN
    previous_state = STATE_BEGIN
    level2_name = "intro"
    level2_title = ""
    level3_name = ""
    level3_title = ""

    content = ""
    with open(fname, "rt") as f:
        while True:
            line = f.readline()
            if not line:
                state = STATE_END
            else:
                if re.match("^##[^#]", line):
                    state = STATE_DOUBLE
                elif re.match("^###[^#]", line):
                    state = STATE_TRIPLE
                else:
                    state = STATE_NORMAL

            if state == STATE_NORMAL:
                content += line
                continue
            else:
                if previous_state == STATE_BEGIN:
                    write_to_file(level2_name + ".md", content)
                elif previous_state == STATE_DOUBLE:
                    write_to_file(level2_name + ".md", content)
                elif previous_state == STATE_TRIPLE:
                    write_to_file(level2_name + "_" + level3_name + ".md", content)
                previous_state = state
                content = ""
                if state == STATE_DOUBLE:
                    level2_name = line[2:].strip().replace(' ', '-').replace('/', '-')
                    toc += "\n" + line + "\n"
                elif state == STATE_TRIPLE:
                    level3_name = line[3:].strip().replace(' ', '-').replace('/', '-')

                    toc += "\n" + line + "\n"
                else: # state == STATE_END
                    break


def main():
    if len(sys.argv) != 2:
        sys.stderr.write("Usage: {} file.md\n".format(sys.argv[0]))
        sys.exit(1)

    split_file(sys.argv[1])
    write_to_file("all.md", toc)


if __name__ == "__main__":
    sys.exit(main())
