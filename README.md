# whichPill

## socket events and data snippet

### Client to Server

#### setNameAndRole

    {
      name:'Yang',
      role:'player',
      cookie: ''
    }
    // another role is 'audience'

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
  choice:1,

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
       "users":[
          {
             "name":"yang",
             "online":true,
             "scores":[
                29,
                -9
             ],
             "sum":220
          },
          {
             "name":"Jordan",
             "online":true,
             "scores":[
                1217,
                21
             ],
             "sum":1438
          },
          {
             "name":"bitch",
             "online":true,
             "scores":[
                31,
                -82
             ],
             "sum":149
          },
          {
             "name":"kelsey",
             "online":true,
             "scores":[
                320,
                798
             ],
             "sum":1318
          }
       ],
       "round":3,
       "whosTurn":{
          "name":"yang",
          "socketId":"111111"
       },
       "questions":[
          [
             {
                "chance":0.17,
                "value":660,
                "backfire":-89
             },
             {
                "chance":0.91,
                "value":24,
                "backfire":0
             }
          ]
       ],
       "lastTurn":{
          "who":"kelsey",
          "which":0,
          "hasWin":true,
          "gain":798
       }
    }

        // states:  'prep', 'inProgress', 'ended'

#### newChat

    // to all
    {
      who:'daniel',
      text:'asdjkfhasjkhdfjkhasdf'
    }

#### gameResetted

nodata
