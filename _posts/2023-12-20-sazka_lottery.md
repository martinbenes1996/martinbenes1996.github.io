---
layout:     post
title:      Chance of winning a lottery
subtitle:   What is the chance of winning a lottery?
date:       2023-12-20
author:     Martin Beneš
header-img: img/sazka_lottery/ticket.png
catalog:    true
katex:      true
tags:
    - probability
    - mathematics
    - combinatorics
    - logic
---


## Sportka

<a href="https://www.sazka.cz/sazka-svet/blog/jak-se-urcuje-vyhra-ve-sportce">Sazka Sportka</a>

Guessing a certain numbers follows hypergeometric distribution.

```
# probabilities
Pr_sportka <- dhyper(0:6, 6, 49-6, 6)
```

<img src="/img/sazka_lottery/guess_probability.png" style="width: 100%" />


### Dodatkové číslo

The competition also contains an additional number, called "dodatkové číslo".

```
# dodatkové číslo
Pr_dodatkove <- 1/(49-6)
```

    0.02325581


### Pořadí

The rewards are organized in orders, called "pořadí".

| Guessed          | Order | Probability       |
| ---------------- | ----- | ----------------- |
| 6/6              | 1.    | $7.2\cdot10^{-8}$ |
| 5/6 + dodatkové  | 2.    | $4.3\cdot10^{-7}$ |
| 5/6              | 3.    | $1.8\cdot10^{-5}$ |
| 4/6              | 4.    | $9.7\cdot10^{-4}$ |
| 3/6              | 5.    | $0.018$           |

The chance of winning anything is 0.01863755.


### Tahy

Sportka is performed in two draws. Each draw has different <a href="https://www.sazka.cz/loterie/sportka/sazky-a-vysledky">reward tables</a>, which changes over time.

```
# rewards
reward_tah1 <- c(0, 0, 0, 112, 630, 24283, 330520)
reward_tah2 <- c(0, 0, 0, 117, 664, 47217, 330520)
reward_poradi2 <- 730000
```

```
avg_reward_tah1 <- (
    Pr_sportka %*% (reward_tah1 - 20) +
    Pr_sportka[5+1]*Pr_dodatkove*(reward_poradi2 - 20))
avg_reward_tah2 <- (
    Pr_sportka %*% (reward_tah2) +
    Pr_sportka[5+1]*Pr_dodatkove*(reward_poradi2))
avg_reward <- avg_reward_tah1 + avg_reward_tah2
```

    -12.7



## Šance

<a href="https://www.sazka.cz/centrum-podpory/loterie-a-hry/loterie/sportka/jak-zjistit-vyhru-v-doplnkove-hre-sance">Sazka Šance</a>


```
# probability of sance
Pr_sance <- 1/10^(1:6)
Pr_sance <- c(1-sum(Pr_sance), Pr_sance)
```

```
# reward of sance
rewards_sance <- c(0, 50, 100, 10^3, 10^4, 10^5, 970000)
avg_reward_sance <- Pr_sance %*% (rewards_sance - 20)
avg_reward_sance
```

    -10
