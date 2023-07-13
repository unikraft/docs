+++
title = "GSoC'23: Packaging Pre-built Micro-libraries for Faster and More Secure Builds (Part 2)"
date = "2023-07-12T00:20:00+08:00"
author = "Zeyu Li"
tags = ["GSOC'23", "Build tools"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

The previous [post](https://unikraft.org/blog/2023-06-23-unikraft-gsoc-packaging-libs-1/) explains why it's important to do the pre-packaging and how I adapted to the [kraftkit](https://github.com/unikraft/kraftkit) project.

In this post, I'm going to talk about current progress and Next Steps.

## Current Progress

I've completed the [error tracking PR](https://github.com/unikraft/kraftkit/pull/479), which is a modification to the way the project prints error messages, replacing the original `fmt.Errorf()` prints with a [third-party package](https://github.com/juju/errors). 

After the completion of the project, in the event of an error, it will be able to accurately print the call chain information of the error message, including the file name, function name, and the number of lines.

For the project, my mentors and I have discussed the result of completing the PR for bug tracking before discussing the start.
Currently the PR has been revised again as per their suggestion.
a tentative date of July 14th has been set to discuss the details of the project and the mid-term check.

## Next Steps

I'll add more after the discussion. 