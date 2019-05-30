# PetrinetFun

Visualization of Petri net invariants 


## Background

I'm teaching Petri nets as a means to model processes and process interaction, in a lecture on operating systems. They're only a side topic, so my focus is on the FUNdamentals: structure, marking, firing, and invariants. I believe that place and transition invariants are key to building and understanding long-running Petri net models, which is the kind of models I care about.
And I seriously think that Petri nets are FUN, hence the project name.

For selected examples during my lectures, I'm using an overhead projector and paper cutouts to visualize place invariants. However, I'm looking for a way to present those invariants for all of my examples, not just a few. Preferably not only during the lectures, but also for self-study afterwards. Something that renders in a browser would serve both purposes.


### Aren't there enough Petri net tools already?

_Sigh_. As of May 2019, I've gone through the whole list of entries in the [Petri Net Tools Database](https://www.informatik.uni-hamburg.de/TGI/PetriNets/tools/quick.html), trying to chase down most of the many broken links, looking at dozens of more or less abandoned projects.
The most charming one I found is [Petit Petri](http://scg.unibe.ch/download/petitpetri/), built on top of a learning platform for children.
There are a bunch of active projects, too. Mostly academic, with a focus on analysis techniques or graph algorithms. Neither of these topics is relevant on the simple level that I'm teaching.
Some tools have a focus on workflows, like [WoPeD](http://www.woped.org/). Workflows start and end, which is the opposite of the long-running Petri nets I'm interested in.
Some tools are platform specific, like the popular [CPN Tools](http://cpntools.org/) for Windows. I'm looking for a cross-platform tool that runs at least on Windows, Linux, and Mac. (WINE does not count.)

Many of these tools implement a graphical Petri net editor. Most of those also have a token animation mode, which is nice. Some can compute invariants. However, I'm not aware of any that can graphically highlight the invariants of a model. And that's the feature I desire.


### Why not contribute to an existing Open Source project?

Many tools are Open Source, but I found none that are community projects. They're either efforts of individuals, like [PIPE 5](https://github.com/sarahtattersall/PIPE/graphs/contributors). Or they are controlled by an academic group, like [GreatSPN](https://github.com/greatspn/SOURCES). Either way, there is little to no public discussion of features and pull requests. Some of the academic projects are not even hosting their sources in a public repository, they just provide tarballs for download. None of the projects I looked at has attracted a community, and many don't even try.
Maybe I've missed some community project. For example, I barely glimpsed at projects in C/C++, because I don't want to mess with C/C++ UI toolkits or multi-platform compilation. I also don't want an Eclipse plug-in, because I don't fancy IDEs.
But taking into account the frequency of [Petri net questions on Stack Overflow](https://stackexchange.com/search?q=petri+net) and associated sites, I do not believe there is enough public interest to carry a community project around Petri nets anyway.

Another reason is that I'm wary of digging into an existing codebase. From some file formats I have looked at, including [PNML](http://www.pnml.org/), I got the impression that the prevalent data representation for Petri nets is very much different from what I have in mind.
Most of the Open Source projects for Petri nets are [GPL](https://www.gnu.org/licenses/) licensed. If I dig into one of those codebases, and then decide to roll my own after all, I'd still do some things in the same way as I have seen them there. That means my work would become a derived work, and I'd have to apply the GPL to it, although I prefer to use more liberal licenses. Therefore, I am avoiding to even look at source code of other Petri net tools.


### So how is this project going to improve the situation?

[It won't](https://xkcd.com/927/).
It will be just another project with [bus factor](https://en.wikipedia.org/wiki/Bus_factor) 1. I'll abandon it when it becomes good enough for my purposes, or when something more interesting occupies my time.
To make this project worth my while, I'll focus on features not provided by existing tools, first and foremost the visualization of invariants.
I'll also use it to learn a new programming language or two, and to test my ideas about internal data representation for Petri nets.
In summary, I plan to scratch my itch, and to have some FUN along the way.
Contributions by others are most welcome, but I won't hold my breath for them.
