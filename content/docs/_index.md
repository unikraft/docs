---
title: "Docs"
description: "Unikraft Documentation"
date: 2020-01-11T14:09:21+09:00
draft: false
showTitle: false
enableToc: false
---

## Welcome to Unikraft's Documentation! 👋

<p class="text-lg text-gray-600s">Unikraft is a Unikernel Development Kit and consists of an extensive build
system in addition to core and external library ecosystem which facilitate the
underlying functionality of a unikernel.</p>

This documentation is organized into guides for operators of Unikraft unikernels
who wish to run lightweight VMs; developers who wish to package pre-existing
applications into a unikernel; and, hackers, researchers and staff who wish
to extend Unikraft itself.

## What to read next

Get familiar with some of the core concepts which makes using a unikernel:

<div class="grid grid-cols-1 gap-x-5 gap-y-5 xl:grid-cols-2 xl:gap-y-5">
  <div class="relative flex items-start p-5 rounded-lg bg-red-100">
    <div class="w-16 h-16 overflow-hidden flex-nones">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4H6v6h4V4z"></path><path d="M18 14h-4v6h4v-6z"></path><path d="M14 4h2v6m-2 0h4"></path><path d="M6 14h2v6m-2 0h4"></path></svg>
    </div>
    <div class="flex-auto ml-4">
      <a class="mb-2 text-xl font-bold text-red-900 dark:text-red-200" href="/docs/concepts">
        What's a unikernel?
      </a>
      <div class="prose prose-sm text-red-900 dark:prose-dark">
        Learn about the core concepts and how Unikraft is able to achieve extreme performance and security benefits compared to existing technologies.
      </div>
    </div>
  </div>

  <div class="relative flex items-start p-5 rounded-lg bg-blue-100">
    <div class="w-16 h-16 overflow-hidden flex-nones">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path></svg>
    </div>
    <div class="flex-auto ml-4">
      <a class="mb-2 text-xl font-bold text-gray-900 dark:text-gray-200" href="/docs/getting-started">
        Building your first unikernel
      </a>
      <div class="prose prose-sm text-blue-900 dark:prose-dark">
        You're convinced of unikernels, "they're the future", you cry and now you want to learn how to quickly and easily build one.  This is the tutorial for you.
      </div>
    </div>
  </div>

  <div class="relative flex items-start p-5 rounded-lg bg-green-100">
    <div class="w-16 h-16 overflow-hidden flex-nones">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
    </div>
    <div class="flex-auto ml-4">
      <span class="mb-2 text-xl font-bold text-gray-900 dark:text-gray-200">
        <a class="before:absolute before:inset-0" href="/docs/operations">Operating a unikernel in production</a>
      </span>
      <div class="prose prose-sm text-green-900 dark:prose-dark">
        Platform-specific tools, tutorials, techniques, troubleshooting guides and more for running unikernels in production environments.
      </div>
    </div>
  </div>

  <div class="relative flex items-start p-5 rounded-lg bg-yellow-100">
    <div class="w-16 h-16 overflow-hidden flex-nones">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    </div>
    <div class="flex-auto ml-4">
      <span class="mb-2 text-xl font-bold text-gray-900 dark:text-gray-200">
        <a class="before:absolute before:inset-0" href="/docs/help-and-support">
          Help &amp; Support
        </a>
      </span>
      <div class="prose prose-sm text-yellow-900 dark:prose-dark">
        Running into problems?  Found a bug?  Find out more about ways to receive support for your specific use case or scenario.
      </div>
    </div>
  </div>

  <div class="relative flex items-start p-5 rounded-lg bg-orange-100">
    <div class="w-16 h-16 overflow-hidden flex-nones">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-orange-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10H4a2 2 0 01-2-2V4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2"></path><path d="M6 14H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2h-2"></path><path d="M13 6l-4 6h6l-4 6"></path></svg>
    </div>
    <div class="flex-auto ml-4">
      <span class="mb-2 text-xl font-bold text-gray-900 dark:text-gray-200">
        <a class="before:absolute before:inset-0" href="/docs/concepts/architecture">Specialised APIs</a>
      </span>
      <div class="prose prose-sm text-gray-900 dark:prose-dark">
        Dive deeper into Unikraft internals and expose high-performance APIs and more to your application, for specific usecases.
      </div>
    </div>
  </div>

  <div class="relative flex items-start p-5 rounded-lg bg-purple-100">
    <div class="w-16 h-16 overflow-hidden flex-nones">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"></path><path d="M14 9.3V1.99"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 11-4 0"></path><path d="M5.58 16.5h12.85"></path></svg>
    </div>
    <div class="flex-auto ml-4">
      <span class="mb-2 text-xl font-bold text-gray-900 dark:text-gray-200">
        <a class="before:absolute before:inset-0" href="/docs/develop"">
          Research &amp; Development
        </a>
      </span>
      <div class="prose prose-sm text-purple-900 dark:prose-dark">
        Learn more about how Unikraft is evaluated and backed by academic excellence and references to additional resources which highlight on-going development.
      </div>
    </div>
  </div>

  <div class="relative xl:col-span-2 flex items-start p-5 rounded-lg bg-blue-100">
    <div class="text-blue-600 text-lg">
      Looking to get involved? <a href="/docs/contributing" class="font-medium text-blue-800">Contributions are welcome!</a> Unikraft is an open-source project hosted on <a href="https://github.com/unikraft" class="font-medium text-blue-800 no-underline hover:underline">GitHub</a> with <a href="/community/meetings" class="font-medium text-blue-800 no-underline hover:underline">weekly communitiy meetings</a> on <a href="https://bit.ly/UnikraftDiscord" class="font-medium text-blue-800 no-underline hover:underline">Discord</a> which follow <a href="#" class="font-medium text-blue-800 no-underline hover:underline">on-going projects</a>.  There are also <a href="https://github.com/orgs/unikraft/projects?type=beta" class="font-medium text-blue-800 no-underline hover:underline">unclaimed projects</a>, <a href="https://github.com/unikraft/unikraft/issues" class="font-medium text-blue-800 no-underline hover:underline">open issues</a>, and opportunities for <a href="/community/contacts/">bachelors and masters theses</a>.
    </div>
  </div>
</div>
