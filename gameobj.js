game = {
    totalTurns: 1000,
    running: true,
    gameId: 0,
    map: '',
    players: [
        {
            id: 0,
            color: 'orange',
            name: 'myBots',
            pollen: 0,
            pos: [Array
            ],
            elo: 115,
            dir: ''
        },
        {
            id: 1,
            color: 'red',
            name: 'myBots',
            pollen: 0,
            pos: [Array
            ],
            elo: 115,
            dir: ''
        },
        {
            id: 2,
            color: 'blue',
            name: 'myBots',
            pollen: 0,
            pos: [Array
            ],
            elo: 115,
            dir: ''
        },
        {
            id: 3,
            color: 'green',
            name: 'myBots',
            pollen: 0,
            pos: [Array
            ],
            elo: 115,
            dir: ''
        }
    ],
    idTurn: 0,
    turn: 0,
    mapSize: 20,
    mapNumber: 0,
    bases: [
        {
            pos: [Array
            ], pollen: 0, id: 0
        },
        {
            pos: [Array
            ], pollen: 0, id: 1
        },
        {
            pos: [Array
            ], pollen: 0, id: 2
        },
        {
            pos: [Array
            ], pollen: 0, id: 3
        }
    ],
    barricades: [
        [
            7,
            12
        ],
        [
            12,
            12
        ],
        [
            12,
            7
        ],
        [
            7,
            7
        ],
        [
            16,
            1
        ],
        [
            3,
            1
        ],
        [
            3,
            18
        ],
        [
            16,
            18
        ],
        [
            2,
            11
        ],
        [
            17,
            11
        ],
        [
            17,
            8
        ],
        [
            2,
            8
        ],
        [
            15,
            6
        ],
        [
            4,
            6
        ],
        [
            4,
            13
        ],
        [
            15,
            13
        ],
        [
            9,
            2
        ],
        [
            10,
            2
        ],
        [
            10,
            17
        ],
        [
            9,
            17
        ],
        [
            10,
            13
        ],
        [
            9,
            13
        ],
        [
            9,
            6
        ],
        [
            10,
            6
        ],
        [
            12,
            4
        ],
        [
            7,
            4
        ],
        [
            7,
            15
        ],
        [
            12,
            15
        ],
        [
            17,
            3
        ],
        [
            2,
            3
        ],
        [
            2,
            16
        ],
        [
            17,
            16
        ],
        [
            19,
            2
        ],
        [
            0,
            2
        ],
        [
            0,
            17
        ],
        [
            19,
            17
        ],
        [
            19,
            7
        ],
        [
            0,
            7
        ],
        [
            0,
            12
        ],
        [
            19,
            12
        ],
        [
            12,
            13
        ],
        [
            7,
            13
        ],
        [
            7,
            6
        ],
        [
            12,
            6
        ],
        [
            5,
            0
        ],
        [
            14,
            0
        ],
        [
            14,
            19
        ],
        [
            5,
            19
        ],
        [
            19,
            3
        ],
        [
            0,
            3
        ],
        [
            0,
            16
        ],
        [
            19,
            16
        ],
        [
            15,
            8
        ],
        [
            4,
            8
        ],
        [
            4,
            11
        ],
        [
            15,
            11
        ],
        [
            12,
            10
        ],
        [
            7,
            10
        ],
        [
            7,
            9
        ],
        [
            12,
            9
        ],
        [
            15,
            10
        ],
        [
            4,
            10
        ],
        [
            4,
            9
        ],
        [
            15,
            9
        ],
        [
            12,
            0
        ],
        [
            7,
            0
        ],
        [
            7,
            19
        ],
        [
            12,
            19
        ],
        [
            5,
            7
        ],
        [
            14,
            7
        ],
        [
            14,
            12
        ],
        [
            5,
            12
        ],
        [
            14,
            15
        ],
        [
            5,
            15
        ],
        [
            5,
            4
        ],
        [
            14,
            4
        ],
        [
            0,
            18
        ],
        [
            19,
            18
        ],
        [
            19,
            1
        ],
        [
            0,
            1
        ],
        [
            11,
            15
        ],
        [
            8,
            15
        ],
        [
            8,
            4
        ],
        [
            11,
            4
        ],
        [
            5,
            6
        ],
        [
            14,
            6
        ],
        [
            14,
            13
        ],
        [
            5,
            13
        ],
        [
            5,
            6
        ],
        [
            14,
            6
        ],
        [
            14,
            13
        ],
        [
            5,
            13
        ],
        [
            15,
            18
        ],
        [
            4,
            18
        ],
        [
            4,
            1
        ],
        [
            15,
            1
        ],
        [
            13,
            12
        ],
        [
            6,
            12
        ],
        [
            6,
            7
        ],
        [
            13,
            7
        ],
        ... 64 more items
    ],
    flowers: [
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        },
        {
            pollen: 1, pos: [Array
            ]
        }
    ],
    myBot: {
        id: 0,
        color: 'orange',
        name: 'myBots',
        pollen: 0,
        pos: [
            3,
            3
        ],
        elo: 115,
        dir: ''
    },
    myBase: {
        pos: [
            3,
            3
        ], pollen: 0, id: 0
    }
}
