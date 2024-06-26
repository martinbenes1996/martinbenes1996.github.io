# https://www.sazka.cz/loterie/sportka/sazky-a-vysledky
# https://www.sazka.cz/sazka-svet/blog/jak-se-urcuje-vyhra-ve-sportce
# https://www.sazka.cz/centrum-podpory/loterie-a-hry/loterie/sportka/jak-zjistit-vyhru-v-doplnkove-hre-sance

library(ggplot2)
library(plyr)
#library(stats)

# sportka
Pr_sportka <- dhyper(0:6, 6, 49-6, 6)
Pr_sportka[6+1]  # 6/6 (1. poradi)
Pr_sportka[5+1]*Pr_dodatkove # 5/6 + 1 (2. poradi)
Pr_sportka[5+1]  # 5/6 (3. poradi)
Pr_sportka[4+1]  # 4/6 (4. poradi)
Pr_sportka[3+1]  # 3/6 (5. poradi)
1 - sum(Pr_sportka[0:2+1])  # cokoli
ggplot(data.frame(Uhodnuto=0:6, Pr=Pr_sportka)) +
  geom_bar(aes(x=Uhodnuto, y=Pr_sportka), stat="identity", fill="steelblue") +
  theme_minimal() +
  scale_x_continuous(breaks=0:6) +
  xlab("Numbers guessed") +
  ylab("Probability") +
  theme(text = element_text(size=20))
ggsave("guess_probability.png", width=10, height=3)

# sportka - simulation
set.seed(12345)
bet <- sample(1:49, 6, replace=F)
win <- replicate(100000, length(intersect(sample(1:49, 6), bet)))
table(win) / length(win)
setNames(Pr_sportka, 0:6)

# sportka
Pr_dodatkove <- 1/(49-6)  # dodatkove cislo

# rewards
reward_tah1 <- c(0, 0, 0, 112, 630, 24283, 330520)
reward_tah2 <- c(0, 0, 0, 117, 664, 47217, 330520)
reward_poradi2 <- 730000
reward_sance <- c(0, 50, 100, 10^3, 10^4, 10^5, 970000)

# average reward
avg_reward_tah1 <- (
  Pr_sportka %*% reward_tah1 +
    Pr_sportka[6] * Pr_dodatkove * reward_poradi2)
avg_reward_tah2 <- (
  Pr_sportka %*% reward_tah2 +
    Pr_sportka[6] * Pr_dodatkove * reward_poradi2)
avg_reward_sportka <- avg_reward_tah1 + avg_reward_tah2
avg_reward_sportka - 20

# sance
Pr_sance <- 1/10^(1:6)
Pr_sance <- c(1-sum(Pr_sance), Pr_sance)
sum(Pr_sance[2:7])
avg_reward_sance <- Pr_sance %*% rewards_sance
avg_reward_sance - 20

# superjackpot
reward_superjackpot <- 151000000
avg_reward <- (
  # tah 1+2
  avg_reward_sportka +
  # sance
  avg_reward_sance +
  # superjackpot
  Pr_sportka[6+1]*sum(Pr_sance[2:7])*reward_superjackpot +
  Pr_sportka[6+1]*sum(Pr_sance[2:7])*reward_superjackpot) - 40

# multiple columns
ggplot(data.frame(`Vsazeno`=1:10, cols=1-sum(Pr_sportka[1:3])^(1:10))) +
  geom_bar(aes(x=Vsazeno, y=cols), stat="identity", fill="steelblue") +
  theme_minimal() +
  xlab("Vsazeno sloupců") +
  ylab("Pravděpodobnost výhry") +
  scale_x_continuous(breaks=1:10) +
  theme(text = element_text(size=20))
ggsave("multi_column.png", width=10, height=5)

