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

Sportka is a popular lottery in Czechia, with an average superjackpot over 100M CZK.
What is the chance of winning the lottery?
How much one loses by long-term betting?
Today, we shall answer these questions.


## Ticket

A Sazka lottery ticket shown below contains 10 identical columns, each with numbers 1-49.
In each round of Sportka, 6 distinct numbers are drawn from 1-49.
Better selects 6 numbers in the column, the reward depends on how many chosen numbers were drawn.

<img src="/img/sazka_lottery/ticket.png" style="display: block; width: 30em; margin-left: auto; margin-right: auto;"/>

A bottom-right corner of each ticket contains a unique number.
Apart from ticket identification, this number is also used for a supplementary game "Šance".
A 6-digit number is drawn, and the reward for Šance is based on length of matched suffix digits with the ticket identifier.

The ticket is used for 2 draws, each connected with different rewards.
Sportka is played twice a week.
As of 2023, the price for one column is 20 CZK, and the price for Šance is also 20 CZK.

There exists <a href="https://www.sazka.cz/sazka-svet/blog/jak-se-urcuje-vyhra-ve-sportce">a similar blogpost</a> modelling Sportka, but the modelling there is wrong.


## Sportka

For simplicity, we assume a single lottery draw, and a single column bet.
Playing sportka can be understood as blindly picking $6$ stones from a bag of $6$ black and $43$ white stones, and counting black stones in the pick.

Sportka follows **hypergeometric** distribution - a binomial distribution with replacement.

```
Pr_sportka <- dhyper(0:6, 6, 49-6, 6)
```

<img src="/img/sazka_lottery/guess_probability.png" style="display: block; width: 30em; margin-left: auto; margin-right: auto;" />

The probabilities can be also estimated via simulation,
but it fails to correctly estimate the probabilities of rare events, such as superjackpot.

```
library(plyr)
set.seed(12345)
bet <- sample(1:49, 6, replace=F)
win <- replicate(100000, length(intersect(sample(1:49, 6), bet)))
table(win) / length(win)
```

          0       1       2       3       4
    0.43781 0.41226 0.13187 0.01706 0.00100

```
Pr_sportka
```
    4.359650e-01 4.130195e-01 1.323780e-01 1.765040e-02 9.686197e-04 1.844990e-05 7.151124e-08


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


### Average reward of Sportka

```
avg_reward_tah1 <- (
    Pr_sportka %*% reward_tah1 +
    Pr_sportka[6] * Pr_dodatkove * reward_poradi2)
avg_reward_tah2 <- (
    Pr_sportka %*% (reward_tah2) +
    Pr_sportka[6]*Pr_dodatkove*(reward_poradi2) +
    Pr_sportka[7] * sum(Pr_sance[2:7]) * reward_superjackpot))
avg_reward_sportka <- avg_reward_tah1 + avg_reward_tah2 - 20
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


## Superjackpot

Superjackpot involves winning 1. order (pořadí) as well as at least one digit of Šance.

```
reward_superjackpot <- 151000000
```

```
avg_reward <- (
    avg_reward_sportka +
    avg_reward_sance +
    Pr_sportka[7] * sum(Pr_sance[2:7]) * (reward_superjackpot - 40) +
    Pr_sportka[7] * sum(Pr_sance[2:7]) * reward_superjackpot)
```

    -20.3
