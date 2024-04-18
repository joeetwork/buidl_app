export type AnchorEscrow = {
  "version": "0.1.0",
  "name": "anchor_escrow",
  "constants": [
    {
      "name": "REQUEST",
      "type": "string",
      "value": "\"request\""
    },
    {
      "name": "UPLOAD",
      "type": "string",
      "value": "\"upload\""
    },
    {
      "name": "VALIDATE",
      "type": "string",
      "value": "\"validate\""
    },
    {
      "name": "EXCHANGE",
      "type": "string",
      "value": "\"exchange\""
    },
    {
      "name": "CLOSE",
      "type": "string",
      "value": "\"close\""
    },
    {
      "name": "ESCROW",
      "type": "bytes",
      "value": "[101, 115, 99, 114, 111, 119]"
    },
    {
      "name": "USER",
      "type": "bytes",
      "value": "[117, 115, 101, 114]"
    },
    {
      "name": "METADATA",
      "type": "bytes",
      "value": "[109, 101, 116, 97, 100, 97, 116, 97]"
    },
    {
      "name": "VALIDATE",
      "type": "bytes",
      "value": "[118, 97, 108, 105, 100, 97, 116, 101]"
    },
    {
      "name": "UPLOAD",
      "type": "bytes",
      "value": "[117, 112, 108, 111, 97, 100]"
    }
  ],
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "u64"
        },
        {
          "name": "initializerAmount",
          "type": "u64"
        },
        {
          "name": "validator",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "taker",
          "type": "publicKey"
        },
        {
          "name": "verifiedCollection",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "about",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeUser",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "about",
          "type": "string"
        },
        {
          "name": "role",
          "type": "string"
        },
        {
          "name": "pfp",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "links",
          "type": {
            "defined": "UserLinks"
          }
        }
      ]
    },
    {
      "name": "cancel",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "uploadWork",
      "accounts": [
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "uploadWork",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "file",
          "type": "string"
        }
      ]
    },
    {
      "name": "acceptRequest",
      "accounts": [
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "declineRequest",
      "accounts": [
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "acceptWithCollection",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "declineWithCollection",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "countVote",
      "accounts": [
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "acceptWithUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "declineWithUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "validateWithEmployer",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "exchange",
      "accounts": [
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "takerReceiveTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seed",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "initializer",
            "type": "publicKey"
          },
          {
            "name": "taker",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "initializerAmount",
            "type": "u64"
          },
          {
            "name": "verifiedCollection",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "validator",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "validatorCount",
            "type": "i8"
          },
          {
            "name": "uploadWork",
            "type": "string"
          },
          {
            "name": "voteDeadline",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "about",
            "type": "string"
          },
          {
            "name": "status",
            "type": "string"
          },
          {
            "name": "amountOfVoters",
            "type": "u8"
          },
          {
            "name": "links",
            "type": {
              "defined": "UserLinks"
            }
          }
        ]
      }
    },
    {
      "name": "upload",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "dev",
            "type": "publicKey"
          },
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "uploadWork",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "about",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initializer",
            "type": "publicKey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "about",
            "type": "string"
          },
          {
            "name": "role",
            "type": "string"
          },
          {
            "name": "pfp",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "links",
            "type": {
              "defined": "UserLinks"
            }
          }
        ]
      }
    },
    {
      "name": "validate",
      "type": {
        "kind": "struct",
        "fields": []
      }
    }
  ],
  "types": [
    {
      "name": "UserLinks",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "twitter",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "discord",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "telegram",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "github",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    }
  ]
};

export const IDL: AnchorEscrow = {
  "version": "0.1.0",
  "name": "anchor_escrow",
  "constants": [
    {
      "name": "REQUEST",
      "type": "string",
      "value": "\"request\""
    },
    {
      "name": "UPLOAD",
      "type": "string",
      "value": "\"upload\""
    },
    {
      "name": "VALIDATE",
      "type": "string",
      "value": "\"validate\""
    },
    {
      "name": "EXCHANGE",
      "type": "string",
      "value": "\"exchange\""
    },
    {
      "name": "CLOSE",
      "type": "string",
      "value": "\"close\""
    },
    {
      "name": "ESCROW",
      "type": "bytes",
      "value": "[101, 115, 99, 114, 111, 119]"
    },
    {
      "name": "USER",
      "type": "bytes",
      "value": "[117, 115, 101, 114]"
    },
    {
      "name": "METADATA",
      "type": "bytes",
      "value": "[109, 101, 116, 97, 100, 97, 116, 97]"
    },
    {
      "name": "VALIDATE",
      "type": "bytes",
      "value": "[118, 97, 108, 105, 100, 97, 116, 101]"
    },
    {
      "name": "UPLOAD",
      "type": "bytes",
      "value": "[117, 112, 108, 111, 97, 100]"
    }
  ],
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "u64"
        },
        {
          "name": "initializerAmount",
          "type": "u64"
        },
        {
          "name": "validator",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "taker",
          "type": "publicKey"
        },
        {
          "name": "verifiedCollection",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "about",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeUser",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "about",
          "type": "string"
        },
        {
          "name": "role",
          "type": "string"
        },
        {
          "name": "pfp",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "links",
          "type": {
            "defined": "UserLinks"
          }
        }
      ]
    },
    {
      "name": "cancel",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "uploadWork",
      "accounts": [
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "uploadWork",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "file",
          "type": "string"
        }
      ]
    },
    {
      "name": "acceptRequest",
      "accounts": [
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "declineRequest",
      "accounts": [
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "acceptWithCollection",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "declineWithCollection",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "countVote",
      "accounts": [
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "acceptWithUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "declineWithUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "validateWithEmployer",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validateState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "exchange",
      "accounts": [
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "takerReceiveTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seed",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "initializer",
            "type": "publicKey"
          },
          {
            "name": "taker",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "initializerAmount",
            "type": "u64"
          },
          {
            "name": "verifiedCollection",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "validator",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "validatorCount",
            "type": "i8"
          },
          {
            "name": "uploadWork",
            "type": "string"
          },
          {
            "name": "voteDeadline",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "about",
            "type": "string"
          },
          {
            "name": "status",
            "type": "string"
          },
          {
            "name": "amountOfVoters",
            "type": "u8"
          },
          {
            "name": "links",
            "type": {
              "defined": "UserLinks"
            }
          }
        ]
      }
    },
    {
      "name": "upload",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "dev",
            "type": "publicKey"
          },
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "uploadWork",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "about",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initializer",
            "type": "publicKey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "about",
            "type": "string"
          },
          {
            "name": "role",
            "type": "string"
          },
          {
            "name": "pfp",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "links",
            "type": {
              "defined": "UserLinks"
            }
          }
        ]
      }
    },
    {
      "name": "validate",
      "type": {
        "kind": "struct",
        "fields": []
      }
    }
  ],
  "types": [
    {
      "name": "UserLinks",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "twitter",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "discord",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "telegram",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "github",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    }
  ]
};
