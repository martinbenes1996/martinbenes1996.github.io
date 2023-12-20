---
layout:     post
title:      Sazka lottery
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


<a href="https://www.sazka.cz/centrum-podpory/loterie-a-hry/loterie/sportka/jak-zjistit-vyhru-v-doplnkove-hre-sance">Sazka Šance</a>

        ```R
        # probability of sance
        Pr_sance <- 1/10^(1:6)
        Pr_sance <- c(1-sum(Pr_sance), Pr_sance)

        # reward of sance
        price_sance <- 20
        rewards_sance <- c(0, 50, 100, 10^3, 10^4, 10^5, 970000)
        avg_reward_sance <- Pr_sance %*% (rewards_sance - price_sance)
        avg_reward_sance
        ```




        -10

