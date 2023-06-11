# EO Chaser Calculator

For Etrian Odyssey games, calculate the expected number of follow-up attacks for chaser-type skills.

Below I will provide an brief explanation of the arguments the page accepts.

- **Maximum Follow-Ups**: The upper limit of the number of follow-up attacks that can occur.
- **Chance Reduction**: The follow-up chance reduction after each successful chase.
- **Number of Attacks (Probability)**: The probability of each number of attacks occurring, entered as a decimal (ex; 0.5)
  - _Note:_ The variable number of attacks is to allow skills like Swashbuckling which may activate any number of times. If you have a fixed number of attacks then type that number with probability 1.00.
- **Number of Simulations**: Number of samples to draw to get results. Larger numbers result in more stable estimates, at the cost of time.

## Example

- Buccaneer with Lv8 Chase Flame (14% Chance Reduction, Max 8 Follow-Ups)
- Ally Zodiac will proc 1 chase
- Ally Shogun/Buccaneer will proc variable number of chases via imbued Lv8 Swashbuckling
    - 2 Hits: 49.00%
    - 3 Hits: 29.40%
    - 4 Hits: 13.23%
    - 5 Hits: 5.29%
    - 6 Hits: 1.98%
    - 7 Hits: 1.10%
- Inputs look like this
![README_img.png]()