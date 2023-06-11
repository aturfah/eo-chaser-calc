# EO Chaser Calculator

For Etrian Odyssey games, calculate the expected number of follow-up attacks for chaser-type skills.

Below I will provide an brief explanation of the arguments the page accepts.

- **Maximum Follow-Ups**: The upper limit of the number of follow-up attacks that can occur.
- **Chance Reduction**: The follow-up chance reduction after each successful chase.
- **Number of Attacks (Probability)**: The probability of each number of attacks occurring, entered as a decimal (ex; 0.5)
  - _Note:_ The variable number of attacks is to allow skills like Swashbuckling which may activate any number of times. If you have a fixed number of attacks then type that number with probability 1.00.
- **Number of Simulations**: Number of samples to draw to get results. Larger numbers result in more stable estimates, at the cost of time.
