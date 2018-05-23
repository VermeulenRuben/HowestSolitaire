# Howest Solitaire Read Me

## Table Of Contents

1.  Repository
2.  App's Function
3.  Used Technology
4.  Hosted by Github Pages

## 1\. Repository

[GitHub Repository of Howest Solitaire](https://github.com/VermeulenRuben/HowestSolitaire)

## 2\. App's Function

This app is a recreation of a game called Solitaire aka Patience. This game doesn't use classic playing cards however. The cards have subtle and literal references to teachers of Howest TI.

For an explanation on how the game of Solitaire is played. I will refer to this Wikipedia article: [Wikipedia - Solitaire/Patience(game)](https://en.wikipedia.org/wiki/Patience_(game))

![Gameplay Image is missing](images/rm/start.png)

My application can be divided into 4 sections according to the html:

1.  The goal

    The goal of the card game is an array of 4 where a card is pushed into. If there is nothing in the goal yet any ace can fit in it. If there is the only the card with the same category and that has the cardnumber following the number of the card currently in the goal can fit in the goal.

    You win the game when each of the 4 arrays are filled in with a card with the cardnumber "k".

2.  The deck

    The deck of the card game is an array of 24\. At the start of a game this array is completely filled with randomly picked cards who have their backs turned. When clicking on the deck you will be able to flip cards. These cards will then be pushed to the given array. When the deck is empty a card with a question mark will appear.

3.  The given

    The given array is an array of 24\. At the start of a game this array will be empty (indicated by the question mark card). When clicking on the deck you will be able to flip cards. These cards will then be pushed to the given array. The cards that were on the deck are then fully visible in the given. When clicking on the given the app will decide if there is a valid position for the card displayed. If there isn't nothing will happen, if there is the card will be placed at the FIRST valid position found and the card will be removed from the given array.

4.  The table