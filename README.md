# Maths Dictionary

As part of an ongoing project on categorical translation, I'm organising an open-source multilingual dictionary of mathematical terminology.
You can see the live website version at https://thosgood.com/maths-dictionary/ .


## Contributors

This dictionary is only as good as its entries, and for this there are many people to thank. Below is a list (in chronological order) of people who have contributed towards this project.

> TJF, Elena Badillo Goicoechea, Pedro Tamaroff, Enric Cosme Llópez, Dilan Demirtaş, Thibaut Benjamin, Fatimah Ahmadi, Övge, Samuel Lelièvre, Besnik Nuro, Natasha Crepeau, Caio Oliveira, Nowras Ali, Maciek Ogrodnik, Matteo Capucci, Jone Uria Albizuri, Ralph Sarkis, Clément Spaier, Jordan Emme, Phil Pützstück, Lucas Viana, Louis Loiseau, Daniele Palombi, Bartosz Milewski, Dariush Moshiri, Hamid reza Khajoei, 李昊达, Özgür Esentepe, Shota, Sven-Ole Behrend, Lukas Graf, Byeongsu Yu, Manuel Hinz, Markus, Zhixuan Yang, Ísabel Pirsic, ruth, Cihan Bahran, ならずもの.


## Todo

- **switch to [Dhall](https://dhall-lang.org/)!**

- languages without gendered nouns should have `"genders": []` instead of no `genders` key at all
- **link adjectives to wikidata/mathworld/eom**
- sort out the way that rows are added for adjectives
    + **use `row.add()`?**
    + **initial `refs` column for adjectives**
- make language header row sticky at top
- support for multiple atoms
    + e.g. regional variations, or just synonyms
- a way to inherit adjectives from another entry!
    + e.g. give a list of hashes of adjectives that "group" should inherit from "ring"
- search should also search through adjectives
- LTR/RTL should be reflected in `text-align` in the css
- add plurals of nouns (and thus adjectives)
    + will also need cases... (for e.g. `DE`)
- think about verbs...

(<https://www.freeformatter.com/json-escape.html> is useful)


## Existing dictionary resources

- [http://diposit.ub.edu/dspace/bitstream/2445/9703/6/matematiques2.pdf](http://diposit.ub.edu/dspace/bitstream/2445/9703/6/matematiques2.pdf)
- [https://www.cocentaina.es/upload/files/serveis-municipals/aviva/archivo1927.pdf](https://www.cocentaina.es/upload/files/serveis-municipals/aviva/archivo1927.pdf)
- [https://en.wikipedia.org/wiki/Glossary_of_algebraic_geometry](https://en.wikipedia.org/wiki/Glossary_of_algebraic_geometry)
- [https://www.lambdabetaeta.eu/ctgr.html](https://www.lambdabetaeta.eu/ctgr.html)
- [https://www.euskaltzaindia.eus/dok/iker_jagon_tegiak/Matematika_Oinarrizko_Lexikoa.pdf](https://www.euskaltzaindia.eus/dok/iker_jagon_tegiak/Matematika_Oinarrizko_Lexikoa.pdf)
- [http://math.huji.ac.il/~amit/hebrew_geometric_dictionary_2.pdf](http://math.huji.ac.il/~amit/hebrew_geometric_dictionary_2.pdf)
- [https://ru.wikipedia.org/wiki/Глоссарий_алгебраической_геометрии](https://ru.wikipedia.org/wiki/%D0%93%D0%BB%D0%BE%D1%81%D1%81%D0%B0%D1%80%D0%B8%D0%B9_%D0%B0%D0%BB%D0%B3%D0%B5%D0%B1%D1%80%D0%B0%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B9_%D0%B3%D0%B5%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D0%B8)
- [https://es.wikipedia.org/wiki/Anexo:Glosario_de_teoría_de_anillos](https://es.wikipedia.org/wiki/Anexo:Glosario_de_teor%C3%ADa_de_anillos)
- [https://arxiv.org/pdf/math/0609472.pdf](https://arxiv.org/pdf/math/0609472.pdf)
- [https://www.emaths.co.uk/index.php/teacher-resources/other-resources/english-as-an-additional-language-eal/category/russian](https://www.emaths.co.uk/index.php/teacher-resources/other-resources/english-as-an-additional-language-eal/category/russian)
- [https://dict.tu-chemnitz.de/de-en/lists/math.html](https://dict.tu-chemnitz.de/de-en/lists/math.html)
