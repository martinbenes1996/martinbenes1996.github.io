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


<a href="https://www.sazka.cz/sazka-svet/blog/jak-se-urcuje-vyhra-ve-sportce">Sazka Sportka</a>

```
# probabilities
Pr_sportka <- dhyper(0:6, 6, 49-6, 6)
Pr_dodatkove <- 1/(49-6)  # dodatkove cislo
```

| Matched          | Order | Probability       |
| ---------------- | ----- | ----------------- |
| 6/6              | 1.    | $7.2\cdot10^{-8}$ |
| 5/6 + dodatkové  | 2.    | $4.3\cdot10^{-7}$ |
| 5/6              | 3.    | $1.8\cdot10^{-5}$ |
| 4/6              | 4.    | $9.7\cdot10^{-4}$ |
| 3/6              | 5.    | $1.8\cdot10^{-2}$ |


![guess_probability](/img/sazka_lottery/guess_probability.png)


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
