package main
// SPDX-License-Identifier: BSD-3-Clause
//
// Authors: Alexander Jung <a.jung@lancs.ac.uk>
//
// Copyright (c) 2022, Lancaster University.  All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
// 3. Neither the name of the copyright holder nor the names of its
//    contributors may be used to endorse or promote products derived from
//    this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

import (
  "os"
  "fmt"
  "path"
  "io/ioutil"

  "gopkg.in/yaml.v2"
)

type Person struct {
  Name       string  `yaml:"name"`
  GitHub     string  `yaml:"github"`
  Maintains []string `yaml:"maintains"`
  Reviews   []string `yaml:"reviews"`
  MemberOf  []string `yaml:"member_of"`
}

func (p *Person) AddMaintains(sig string) {
  for _, needle := range p.Maintains {
    if sig == needle {
      return
    }
  }

  p.Maintains = append(p.Maintains, sig)
}

func (p *Person) AddReviews(sig string) {
  for _, needle := range p.Reviews {
    if sig == needle {
      return
    }
  }

  p.Reviews = append(p.Maintains, sig)
}

func (p *Person) AddMemberOf(sig string) {
  for _, needle := range p.MemberOf {
    if sig == needle {
      return
    }
  }

  p.MemberOf = append(p.Maintains, sig)
}

type Team struct {
  Name          string `yaml:"name"`
  Maintainers []Person `yaml:"maintainers"`
  Reviewers   []Person `yaml:"reviewers"`
  Members     []Person `yaml:"members"`
}

func main() {
  if len(os.Args) > 2 || len(os.Args) == 1 {
    fmt.Printf("usage: %s [TEAMSDIR]\n", os.Args[0])
    os.Exit(1)
  }

  people := make(map[string]Person)
  teamsDir := os.Args[1]

  files, err := ioutil.ReadDir(teamsDir)
  if err != nil {
    fmt.Printf("could not read directory: %s\n", err)
    os.Exit(1)
  }

  // Iterate through all files and populate a list of known teams.
  for _, file := range files {
    team := &Team{}

    yamlFile, err := ioutil.ReadFile(path.Join(teamsDir, file.Name()))
    if err != nil {
      fmt.Printf("could not open yaml file: %s\n", err)
      os.Exit(1)
    }

    err = yaml.Unmarshal(yamlFile, team)
    if err != nil {
      fmt.Printf("could not unmarshal yaml file: %s\n", err)
      os.Exit(1)
    }

    // Iterate over all maintainers
    for _, maintainer := range team.Maintainers {
      person, ok := people[maintainer.GitHub]
      if !ok {
        person = maintainer
      }

      person.AddMaintains(team.Name[4:])
      people[maintainer.GitHub] = person
    }

    // Iterate over all reviewers
    for _, reviewer := range team.Reviewers {
      person, ok := people[reviewer.GitHub]
      if !ok {
        person = reviewer
      }

      person.AddReviews(team.Name[4:])
      people[reviewer.GitHub] = person
    }

    // Iterate over all members
    for _, member := range team.Members {
      person, ok := people[member.GitHub]
      if !ok {
        person = member
      }

      person.AddMemberOf(team.Name[4:])
      people[member.GitHub] = person
    }
  }

  d, err := yaml.Marshal(&people)
  if err != nil {
    fmt.Printf("could not marshal YAML: %s", err)
    os.Exit(1)
  }

  fmt.Printf("%s\n", string(d)) 
}
