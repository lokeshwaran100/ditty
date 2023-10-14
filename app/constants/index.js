import { dashboard } from "@/assets"
import { PublicKey } from "@solana/web3.js";

export const NavLinks=[
    {
        name:"DashBoard",
        link:"/",
        svg:{dashboard},
    },
    {
        name:"Create",
        link:"/create",
        svg:{dashboard}
    },
    {
        name:"Profile",
        link:"/profile",
        svg:{dashboard}
    },
    {
        name:"Help and Support",
        link:"/help",
        svg:{dashboard}
    }
]

// The idl from the anchor playground
export const idl={
    "version": "0.1.0",
    "name": "ditty",
    "instructions": [
      {
        "name": "initializechitfund",
        "accounts": [
          {
            "name": "organiser",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "chitFund",
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
            "name": "name",
            "type": "string"
          },
          {
            "name": "commitedamount",
            "type": "u32"
          }
        ]
      },
      {
        "name": "join",
        "accounts": [
          {
            "name": "organiser",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "chitFund",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "participant",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          }
        ]
      },
      {
        "name": "bid",
        "accounts": [
          {
            "name": "organiser",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "chitFund",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "participant",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u32"
          }
        ]
      },
      {
        "name": "deposit",
        "accounts": [
          {
            "name": "organiser",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "chitFund",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "bidWinner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "participant",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "cf",
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
            "name": "name",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u32"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "ChitFund",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "participantCount",
              "type": "u32"
            },
            {
              "name": "commitedAmount",
              "type": "u64"
            },
            {
              "name": "organizer",
              "type": "publicKey"
            },
            {
              "name": "status",
              "type": {
                "defined": "ChitFundStatus"
              }
            },
            {
              "name": "createTime",
              "type": "i64"
            },
            {
              "name": "bids",
              "type": {
                "vec": {
                  "defined": "Bid"
                }
              }
            },
            {
              "name": "participants",
              "type": {
                "vec": {
                  "defined": "Participant"
                }
              }
            },
            {
              "name": "currentMonth",
              "type": "u32"
            },
            {
              "name": "bidWinner",
              "type": "publicKey"
            },
            {
              "name": "lowestBidAmount",
              "type": "u64"
            },
            {
              "name": "depositors",
              "type": {
                "vec": "publicKey"
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "Participant",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "pubkey",
              "type": "publicKey"
            },
            {
              "name": "wonBid",
              "type": "bool"
            }
          ]
        }
      },
      {
        "name": "Bid",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bidder",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "ChitFundStatus",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Open"
            },
            {
              "name": "Closed"
            },
            {
              "name": "BiddingOpen"
            },
            {
              "name": "BiddingClosed"
            },
            {
              "name": "Completed"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "ChitFundClosed",
        "msg": "Chit fund is closed"
      },
      {
        "code": 6001,
        "name": "DuplicateBid",
        "msg": "Duplicate bid from the same participant"
      },
      {
        "code": 6002,
        "name": "DuplicateDeposit",
        "msg": "Duplicate deposit from the same participant"
      },
      {
        "code": 6003,
        "name": "AlreadyWonCannotBid",
        "msg": "Participant already won the bid"
      },
      {
        "code": 6004,
        "name": "BiddingClosed",
        "msg": "Bidding window is closed"
      },
      {
        "code": 6005,
        "name": "InvalidBidAmount",
        "msg": "Invalid bid amount"
      },
      {
        "code": 6006,
        "name": "InitError",
        "msg": "Chit fund has already been initialized"
      },
      {
        "code": 6007,
        "name": "InsufficientParticipation",
        "msg": "Insufficient participation"
      },
      {
        "code": 6008,
        "name": "ParticipantsFull",
        "msg": "Participants is full"
      },
      {
        "code": 6009,
        "name": "NoBids",
        "msg": "Bidding is not possible"
      },
      {
        "code": 6010,
        "name": "DepositFailed",
        "msg": "Cannot deposit funds"
      },
      {
        "code": 6011,
        "name": "DepositDeposit",
        "msg": "Duplicate deposit"
      },
      {
        "code": 6012,
        "name": "BidWinnerCannotDeposit",
        "msg": "Bid winner cannot deposit"
      },
      {
        "code": 6013,
        "name": "BiddingMonthNotStarted",
        "msg": "Bid month not started"
      },
      {
        "code": 6014,
        "name": "InsufficientFundsForTransaction",
        "msg": "Insufficient funds"
      }
    ]
  }

export const CHIT_FUND_PUBLICKEY=new PublicKey("4bXxZicaQg3atfVBkUJzvDw9ryRdxj2KzVrRRYYjzVVq");

