export default [
  {
    constant: false,
    inputs: [
      {
        name: 'encrypted_data_hash',
        type: 'string',
      },
      {
        name: 'private_key_hash',
        type: 'bytes',
      },
      {
        name: 'extra',
        type: 'bytes',
      },
      {
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'create',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'data_item_id',
        type: 'uint256',
      },
    ],
    name: 'participate',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'bidder',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'data_item_id',
        type: 'uint256',
      },
    ],
    name: 'Participate',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'data_item_id',
        type: 'uint256',
      },
    ],
    name: 'refund',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'bidder',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'data_item_id',
        type: 'uint256',
      },
    ],
    name: 'Refund',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'data_item_id',
        type: 'uint256',
      },
      {
        name: 'private_key',
        type: 'string',
      },
    ],
    name: 'withdraw',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'data_item_id',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'data_item_id',
        type: 'uint256',
      },
    ],
    name: 'getCommodityInfo',
    outputs: [
      {
        name: 'id',
        type: 'uint256',
      },
      {
        name: 'value',
        type: 'uint256',
      },
      {
        name: 'encrypted_data_hash',
        type: 'string',
      },
      {
        name: 'status',
        type: 'uint8',
      },
      {
        name: 'received_value',
        type: 'uint256',
      },
      {
        name: 'priv_key_hash',
        type: 'bytes',
      },
      {
        name: 'priv_key',
        type: 'string',
      },
      {
        name: 'my_support',
        type: 'uint256',
      },
      {
        name: 'extra',
        type: 'bytes',
      },
      {
        name: 'publisher',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'start',
        type: 'uint256',
      },
      {
        name: 'limit',
        type: 'uint256',
      },
    ],
    name: 'getCommodityList',
    outputs: [
      {
        components: [
          {
            name: 'id',
            type: 'uint256',
          },
          {
            name: 'extra',
            type: 'bytes',
          },
          {
            name: 'status',
            type: 'uint8',
          },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getMarketInfo',
    outputs: [
      {
        name: 'all',
        type: 'uint64',
      },
      {
        name: 'sold',
        type: 'uint64',
      },
      {
        name: 'selling',
        type: 'uint64',
      },
      {
        name: 'participate',
        type: 'uint64',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
