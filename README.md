# whichPill

## socket events and data snippet

### Client to Server

#### setNameAndRole
```
{
  name:'Yang',
  Role:'player'
}
// another role is 'audience'
```

#### sendCookie

    'cookie string'

#### resetGame(str);

    'fhjghjgjkh'

#### startGame

```

```

#### makeChoice

```{
  who:'Daniel',
  choice:'a',

}
```

#### sendChat

```{
  who:'Daniel',
  text:'asdhjfjksadfjka',
}
```

#### setEndRound

```{
  endRound:7
}
```

### Server to Client

#### gameState

        {
          gameState: 'inProgress',
          Scores:[{name:'', eachRound:[23,0,15,22]}],
          round: 4,
          whosTurn:'Daniel',
          questions: [{
            chance: 0.23;
            value: 125
            },{
              chance: 0.23;
              value: 125
            }]
            lastTurn:{
              who:'Daniel',
              which:'B',
              hasWin: false,
              gain:0,
            }
        }

        // states:  'prep', 'inprogress', 'ended'

#### newChat

    // to all
    {
      who:'daniel',
      text:'asdjkfhasjkhdfjkhasdf'
    }
