---
layout:     post
title:      The Merci cake issue
date:       2025-04-15
author:     Martin Beneš
catalog:    true
katex:      true
tags:
    - geometric modeling
    - applied mathematics
    - discretization
---


My friend Eliška got a cake from Merci chocolate bars and Ferrero Rocher, attached to a base from polystyrene.
It was really finely done, with satisfactory geometric regularity.

<img src="/img/merci_cake_files/cake.jpeg" width = "50%"/>

That got us thinking: how does one even estimate, which base size to buy, not knowing how many Merci pieces fit around its circumference.

The first step is to measure a width of Merci piece, $m$, which is fixed (at least until the next shrinkflation).
Based on my measurements in Linz, Austria on 23 March 2025, $m=1.9$ cm.


```python
m = 1.9  # merci width
```

Next, we tile a circle of radius $r$ with $k$ Merci pieces -- both $r$ and $k$ are unknown.
We want to keep the tiling of the circumference as perfect as possible, i.e., minimize the remaining gap $\epsilon\in[0,m)$ where the bar cannot fit anymore as small as possible.

## Models

### Circular model

The first model simplifies Merci to an arc of the length $m$ on the circle of the sought radius $r$.

<img src="/img/merci_cake_files/circular.png" width = "30%"/>

This implies $k$ Mercis reach the length of $k m$ and the total length is $2\pi r$.
The full model along with the tiling gap is

$$
2\pi r=k\cdot m+\epsilon.
$$

We can actually directly estimate $k$ as $k=\lfloor\frac{2\pi r}{m}\rfloor$.
For the $k$ estimate, we then calculate the gap $\epsilon$.


### Polygon model

Our second attempt is a polygon model with the circular base inscribed inside.


<img src="/img/merci_cake_files/polygon.png" width = "30%"/>

This way, we express the relationship of $m$ and $k$ as

$$
\tan\left(\frac{\pi}{k}\right)=\frac{m}{2r}.
$$

We convert this to arc lengths, to allow for the tiling gap $\epsilon$ as before.

$$
2\pi r = 2kr\arctan\left(\frac{m}{2r}\right)+\epsilon.
$$


## Results

We assess the quantization error over different choices of $r$ and $k$.

```python
import numpy as np
import pandas as pd

df = []
for r in np.arange(4.5,6.5,.1):
    k1 = int(np.floor(2*np.pi*r / m))
    k2 = int(np.floor(np.pi / np.atan(m/2/r)))
    df.append({
        'r': r,
        'circ0': 2*np.pi*r,
        'm': m,
        # circle model

        'k1': k1,
        'eps1': 2*np.pi*r - k1*m,
        'circ1': k1*m,
        # polygon model

        'k2': k2,
        'eps2': 2*np.pi*r - 2*k2*r * np.atan(m/2/r),
        'circ2': 2*k2*r * np.atan(m/2/r),
    })
df = pd.DataFrame(df)
```

The results for both models are presented in the table below.

<table>
  <thead>
    <tr>
      <th>$r$</th>
      <th>$2\pi r$</th>
      <th>$k_\circ$</th>
      <th>$k_\circ m$</th>
      <th>$\epsilon_\circ$</th>
      <th>$k_{\text{⬡}}$</th>
      <th>$2k_{\text{⬡}}r\arctan(\frac{m}{2r})$</th>
      <th>$\epsilon_{\text{⬡}}$</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>4.5</td><td>28.274</td><td>14</td><td>26.6</td><td>1.674</td><td>15</td><td>28.088</td><td>0.187</td></tr>
    <tr><td>4.6</td><td>28.903</td><td>15</td><td>28.5</td><td>0.403</td><td>15</td><td>28.105</td><td>0.798</td></tr>
    <tr><td>4.7</td><td>29.531</td><td>15</td><td>28.5</td><td>1.031</td><td>15</td><td>28.121</td><td>1.410</td></tr>
    <tr><td>4.8</td><td>30.159</td><td>15</td><td>28.5</td><td>1.659</td><td>16</td><td>30.012</td><td>0.147</td></tr>
    <tr><td>4.9</td><td>30.788</td><td>16</td><td>30.4</td><td>0.388</td><td>16</td><td>30.027</td><td>0.760</td></tr>
    <tr><td>5.0</td><td>31.416</td><td>16</td><td>30.4</td><td>1.016</td><td>16</td><td>30.042</td><td>1.374</td></tr>
    <tr><td>5.1</td><td>32.044</td><td>16</td><td>30.4</td><td>1.644</td><td>17</td><td>31.934</td><td>0.110</td></tr>
    <tr><td>5.2</td><td>32.673</td><td>17</td><td>32.3</td><td>0.373</td><td>17</td><td>31.948</td><td>0.725</td></tr>
    <tr><td>5.3</td><td>33.301</td><td>17</td><td>32.3</td><td>1.001</td><td>17</td><td>31.961</td><td>1.340</td></tr>
    <tr><td>5.4</td><td>33.929</td><td>17</td><td>32.3</td><td>1.629</td><td>18</td><td>33.854</td><td>0.076</td></tr>
    <tr><td>5.5</td><td>34.558</td><td>18</td><td>34.2</td><td>0.358</td><td>18</td><td>33.866</td><td>0.692</td></tr>
    <tr><td>5.6</td><td>35.186</td><td>18</td><td>34.2</td><td>0.986</td><td>18</td><td>33.877</td><td>1.308</td></tr>
    <tr><td>5.7</td><td>35.814</td><td>18</td><td>34.2</td><td>1.614</td><td>19</td><td>35.771</td><td>0.043</td></tr>
    <tr><td>5.8</td><td>36.442</td><td>19</td><td>36.1</td><td>0.342</td><td>19</td><td>35.782</td><td>0.660</td></tr>
    <tr><td>5.9</td><td>37.071</td><td>19</td><td>36.1</td><td>0.971</td><td>19</td><td>35.793</td><td>1.278</td></tr>
    <tr><td>6.0</td><td>37.699</td><td>19</td><td>36.1</td><td>1.599</td><td>20</td><td>37.687</td><td>0.012</td></tr>
    <tr><td>6.1</td><td>38.327</td><td>20</td><td>38.0</td><td>0.327</td><td>20</td><td>37.697</td><td>0.630</td></tr>
    <tr><td>6.2</td><td>38.956</td><td>20</td><td>38.0</td><td>0.956</td><td>20</td><td>37.707</td><td>1.249</td></tr>
    <tr><td>6.3</td><td>39.584</td><td>20</td><td>38.0</td><td>1.584</td><td>20</td><td>37.716</td><td>1.868</td></tr>
    <tr><td>6.4</td><td>40.212</td><td>21</td><td>39.9</td><td>0.312</td><td>21</td><td>39.611</td><td>0.602</td></tr>
  </tbody>
</table>

<!-- |     |          | **Circle** |             |                  | **Polygon**    |                                        |                       |
| $r$ | $2\pi r$ | $k_\circ$  | $k_\circ m$ | $\epsilon_\circ$ | $k_{\text{⬡}}$ | $2k_{\text{⬡}} r\arctan(\frac{m}{2r})$ | $\epsilon_{\text{⬡}}$ |
|-----|----------|------------|-------------|------------------|----------------|----------------------------------------|-----------------------|
| 4.5 | 28.274   | 14         | 26.6        | 1.674            | 15             | 28.088                                 | 0.187                 |
| 4.6 | 28.903   | 15         | 28.5        | 0.403            | 15             | 28.105                                 | 0.798                 |
| 4.7 | 29.531   | 15         | 28.5        | 1.031            | 15             | 28.121                                 | 1.410                 |
| 4.8 | 30.159   | 15         | 28.5        | 1.659            | 16             | 30.012                                 | 0.147                 |
| 4.9 | 30.788   | 16         | 30.4        | 0.388            | 16             | 30.027                                 | 0.760                 |
| 5.0 | 31.416   | 16         | 30.4        | 1.016            | 16             | 30.042                                 | 1.374                 |
| 5.1 | 32.044   | 16         | 30.4        | 1.644            | 17             | 31.934                                 | 0.110                 |
| 5.2 | 32.673   | 17         | 32.3        | 0.373            | 17             | 31.948                                 | 0.725                 |
| 5.3 | 33.301   | 17         | 32.3        | 1.001            | 17             | 31.961                                 | 1.340                 |
| 5.4 | 33.929   | 17         | 32.3        | 1.629            | 18             | 33.854                                 | 0.076                 |
| 5.5 | 34.558   | 18         | 34.2        | 0.358            | 18             | 33.866                                 | 0.692                 |
| 5.6 | 35.186   | 18         | 34.2        | 0.986            | 18             | 33.877                                 | 1.308                 |
| 5.7 | 35.814   | 18         | 34.2        | 1.614            | 19             | 35.771                                 | 0.043                 |
| 5.8 | 36.442   | 19         | 36.1        | 0.342            | 19             | 35.782                                 | 0.660                 |
| 5.9 | 37.071   | 19         | 36.1        | 0.971            | 19             | 35.793                                 | 1.278                 |
| 6.0 | 37.699   | 19         | 36.1        | 1.599            | 20             | 37.687                                 | 0.012                 |
| 6.1 | 38.327   | 20         | 38.0        | 0.327            | 20             | 37.697                                 | 0.630                 |
| 6.2 | 38.956   | 20         | 38.0        | 0.956            | 20             | 37.707                                 | 1.249                 |
| 6.3 | 39.584   | 20         | 38.0        | 1.584            | 20             | 37.716                                 | 1.868                 |
| 6.4 | 40.212   | 21         | 39.9        | 0.312            | 21             | 39.611                                 | 0.602                 |
 -->

## Practical assessment

**TBD**