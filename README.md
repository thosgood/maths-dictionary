# Maths Dictionary

As part of an ongoing project on categorical translation, I'm organising an open-source multilingual dictionary of mathematical terminology.
You can see the live website version at https://thosgood.com/maths-dictionary/ .

## Contributors

This dictionary is only as good as its entries, and for this there are many people to thank. Below is a list (in chronological order) of people who have contributed towards this project.

> TJF, Elena Badillo Goicoechea, Pedro Tamaroff, Enric Cosme Llópez, Dilan Demirtaş, Thibaut Benjamin, Fatimah Ahmadi, Övge, Samuel Lelièvre, Besnik Nuro, Natasha Crepeau, Caio Oliveira, Nowras Ali, Maciek Ogrodnik, Matteo Capucci, Jone Uria Albizuri, Ralph Sarkis, Clément Spaier, Jordan Emme, Phil Pützstück, Lucas Viana, Louis Loiseau, Daniele Palombi, Bartosz Milewski.

## Todo

- **show gender**
- **add an initial column with `refs` data (automatically href'd etc)**
    + **this should also show up in the `labs.thosgood.com` submission tool**
- support for multiple atoms
    + e.g. regional variations, or just synonyms
- a way to inherit adjectives from another entry!
    + e.g. give a list of hashes of adjectives that "group" should inherit from "ring"
- search should also search through adjectives
- LTR/RTL information should be used when displaying adjectives!
    + should also be reflected in `text-align` in the css
- add plurals of nouns (and thus adjectives)
    + will also need cases... (for e.g. `DE`)
- **think about verbs...**
- auto sort `EN` on load
- link each entry (**incl. adjectives**) to a wikidata tag
    + any other useful sources?
        * MathWorld and Encyclopedia of Mathematics
- get language selectors in `index.html` from the language `.json` files
    + should get endonyms from there too

(<https://www.freeformatter.com/json-escape.html> is useful)
