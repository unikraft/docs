---
title: Governance
date: 2022-12-28T14:09:21+02:00
draft: false
weight: 600
---

## Governance

Unikraft is an open source software (OSS) project.
To ensure an effective way to drive the project, we use governance principles inspired from other OSS projects.
The governance model is designed to provide structure around how decisions are made, how the various elements of our community interact, and how we work together to achieve our goals.

##  Governance Scope and Terms

- SIGs - Special Interest Groups are persistent open groups that focus on a part of the project. The purpose of a SIG is to own and develop a set of Unikraft components.
- Community Leadership - The community leaders are responsible for the overall project and for driving the project roadmap.
- Meetings - The project has regular meetings. Anyone is welcome to join these meetings. The meetings are used to discuss topics and report progress.
- Roles - The roles and responsibilities of the various members of the community are defined in the [governance repository](https://github.com/unikraft/governance).
- Tasks / Projects - The project uses GitHub issues and projects to track tasks and projects. 
- Contributions - A contribution is any direct or indirect work that is produced by a contributor and accepted by the project. Examples of contributions include code, pull requests, issues, documentation and community participation in events.
- Roadmap - The roadmap is a document that identifies the goals and direction of the project. The roadmap is owned by the community leaders and is a living document that can be updated at any time. The roadmap is used to help guide the decisions of the SIGs and the community leaders.
- Releases - Stable versions of the project are released on a regular basis.
- Values - The values are a set of principles that define the culture, and how the community should work together.

### Special Interest Groups (SIGs)

The Unikraft OSS project is organised on the principle that "everything-is-a-library," whether they are a wrapper library for an external OSS project or library, an architecture, platform or application.
There are also auxiliary repositories and projects which are part of the Unikraft OSS comunity which: aid or facilitate the construction of unikernels, such as with command-line companion tool [`kraft`](https://github.com/unikraft/kraft); forks of upstream libraries; or, anything else.
As a result, there are many repositories and directories within the [Unikraft core repository](https://github.com/unikraft/unikraft) which overlap and represent some interest or focus point.
To address the growing ecosystem, the Unikraft OSS project is organised into self-governing Special Interest Groups (SIGs).
Each SIG oversees some number of libraries, repositories or code and are in themselves responsible for maintaining and reviewing changes.
This means there are dedicated maintainers and dedicated reviewers for each SIG.

 > A list of all Special Interest Groups and their maintainers, reviewers and members can be found in [`teams/`](https://github.com/unikraft/governance/tree/main/teams).

GitHub is the primary SCM used by Unikraft and it offers management tooling for organising persons via the [teams feature](https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams).
The provided tooling offers hierarchical team management, meaning there can exist a sub-team within an existing team.
This feature is utilised in order to create the separation between "maintainers" and "reviewers" whilst still being part of the same SIG.


Each SIG has its own team within the [Unikraft Github organisation](https://github.com/unikraft), identified with `sig-$NAME`.
This represents an outer-most team and `maintainers-$NAME` and `reviewers-$NAME` representing two sub-teams within `sig-$NAME`.
This means that when you look at at all the Unikraft teams on GitHub, it will create something like this:

```
unikraft
├── sig-alloc
│   ├── maintainers-alloc
│   └── reviewers-alloc
├── sig-test
│   ├── maintainers-test
│   └── reviewers-test
├── ...
└── sig-etc
    ├── maintainers-etc
    └── reviewers-etc
```

Members listed in the `maintainers-$NAME` and `reviewers-$NAME` sub-teams will also be members of the higher-order `sig-$NAME` team but with the corresponding GitHub roles of "maintainer" and "member", respectively.
Members of a `sig-$NAME` team which are neither maintainers nor reviewers will simply be listed with the corresponding GitHub "member" role of the `sig-$NAME` team.

The purpose of organising the teams in this way is to:

1. Allow maintainers and reviewers to have their own internal groups for discussion, and to use the available teams feature of GitHub for their desired purposes for these particular role types;
2. Allow for quick reference of the groups of people by their role in any `CODEOWNERS` file and in the CI/CD with the syntax `@sig-$NAME`, or `@maintainers-$NAME` or `@reviewers-$NAME`;
3. We can reference all members of the Special Interest Groups, whether maintainer, reviewer or simply as a member with the handle `@sig-$NAME`;

To join a Special Interest Group, create a pull request on [Governance repository](https://github.com/unikraft/governance) and add new line to the `members:` directive within the relevant team's YAML file, e.g.:

```diff
+   - name: Your Name
+     github: yourusername
```

Please include a short description as why you would like to join the team in your PR.

### Community Leadership

The Unikraft OSS project is led by a group of community leaders who are responsible for the overall direction of the project.
We have different types of leaders, each with their own area of responsibility.
The current list of community leaders is:
- [Răzvan Deaconescu](https://github.com/razvand) - Community Leader
- [Andrei Mutu](https://github.com/mandrei12) - Blog post owner
- [Ștefan Jumarea](https://github.com/StefanJum) - Documentation owner
- [Răzvan Virtan](https://github.com/razvanvirtan) - Release owner
- [Alexander Jung](https://github.com/nderjung) - Website owner
- [Gabi Mocanu](https://github.com/gabrielmocanu) - Governance owner
- [Alexander Jung](https://github.com/nderjung), [Cezar Craciunoiu](https://github.com/craciunoiuc) - CI / CD owners

### Meetings

Most SIGs have weekly or biweekly meeting where progress and problems encountered are discussed.
Meetings take place online, on [the Unikraft Discord server](http://bit.ly/UnikraftDiscord).
They are listed in the [Unikraft OSS Calendar](https://calendar.google.com/calendar/u/0/embed?src=c_0g04rms4mhv2gvlduertbern34@group.calendar.google.com);
a meeting reminder is sent out on the appropriate Discord channel typically a day before the meeting.
Everyone is welcome to join meetings of interest.
Summaries of meetings are stored in the [`meeting-notes` repository](https://github.com/unikraft/meeting-notes/).

### Roles And Responsibilities

Outlines the various responsibilities of contributor roles in Unikraft.
All the work is organized in SIGs, each SIG has members with different roles and responsibilities. 

| Role | Responsibilities | Requirements | Defined by |
| -----| ---------------- | ------------ | -------|
| Member | Active member in the community | Multiple contributions to the projects | Member entry to any [SIG](https://github.com/unikraft/governance/tree/main/teams) |
| Reviewer | Review contributions | Active member with multiple contributions and present at meetings | Reviewer entry to any [SIG](https://github.com/unikraft/governance/tree/main/teams) |
| Maintainer | Approve contributions and suggests improvements | Highly experienced contributor | Maintainer entry to any [SIG](https://github.com/unikraft/governance/tree/main/teams) |

#### Member

Members are continuously active contributors to the community.
They can have issues and PRs assigned to them, participate in SIGs through GitHub teams, and pre-submit tests are automatically run for their PRs.
Members are expected to remain active contributors to the community.

#### Reviewer

Reviewers are members that are active contributors to the community.
Reviewers are responsible for reviewing code contributions and for the quality of the codebase.
They are knowledgeable about the codebase and software engineering principles.
Reviewers are expected to review code contributions in a timely manner.
They are assigned to a SIG and are added as a reviewer in the `CODEOWNERS` file of that SIG.

#### Maintainer

Maintainers are responsible for the overall health and direction of the project.
They are knowledgeable about the codebase and software engineering principles.
Their primary responsibility is to ensure that the code is readable, maintainable, and meets the requirements of the project.
Maintainers are expected to review code contributions in a timely manner.
They are assigned to a SIG and are added as a maintainer in the `CODEOWNERS` file of that SIG.
Maintainers are also responsible for helping new contributors to become familiar with the codebase and contributing process.


### Tasks / Projects

The tasks are organized in [projects](https://github.com/orgs/unikraft/projects).
Usually, a project is created for a specific release and contains the tasks that need to be done for that release.

### Contributions

The [contributing](https://unikraft.org/docs/contributing/) section of the website is the main entry point for new contributors.
It contains information about the project, how to get started, and how to contribute.

### Roadmap

The [roadmap](https://github.com/orgs/unikraft/projects/24/views/35) is a high-level view of the project and is used to communicate the direction of the project to the community.

### Releases

[Releases](https://github.com/unikraft/unikraft/releases) are used to provide a stable version of the project that can be used by the community.
Our release process is based on a schedule, where we release a new version every 2 months.
A detailed view for the release schedule can be found [here](https://github.com/orgs/unikraft/projects/24)

### Values

The Unikraft community is expected to follow the values defined in the [Code of Conduct](https://unikraft.org/docs/contributing/code-of-conduct/).
As the community grows, we strive for kindness, giving feedback effectively, and building a good development environment for all.
