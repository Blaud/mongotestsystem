const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
{  
    created: { type: Date, default: () => Date.now() },
    Message:{  
       timestamp:{
        type: Date,
        default: Date.now,
        index: true
    },
       recipient: {
        type: String,
        default: "79831234567"
    },
       msg_id: {
        type: String,
        default: "da0627a0-9d20-52d1-aad1-5b74a9900db5"
    },
       incoming_protocol: {
        type: String,
        default: "JSONv1"
    },
       incoming_connection_id: {
        type: Number,
        default: 2
    },
       client_id: {
        type: Number,
        default: 1
    },
       channels:{  
          sms:{  
             operator_id: {
                type: Number,
                default: 4
            }, //идентификатор оператора из БД, заполняется только в случае попытки отправки в смс канал
             ttl: {
                type: Number,
                default: 150
            },
             text: {
                type: String,
                default: "text for SMS"
            },
             sender: {
                type: String,
                default: "GMSU"
            },
             operator_name: {
                type: String,
                default: "Tele2"
            }, //имя оператора, заполняется только в случае попытки отправки в смс канал
             mnc: {
                type: Number,
                default: 20
            }, //MNC оператора, заполняется только в случае попытки отправки в смс канал
             mcc: {
                type: Number,
                default: 250
            }, //MCC оператора, заполняется только в случае попытки отправки в смс канал
             country_code: {
                type: String,
                default: "RUS"
            }, //код страны в формате ISO 3166-1 alpha-3, заполняется только в случае попытки отправки в смс канал
             text_length: {
                type: Number,
                default: 12
            }
          }
       },
       incoming_connection_name: {
        type: String,
        default: "Svyazcom_JSONv1"
    },
       client_name: {
        type: String,
        default: "Svyazcom LLC"
    }
    },
    Report:{  
       data:{ //история доставки сообщения, эти данные могут отсутствовать
          reports:[  //массив всех отчетов, которые были собраны от канальных модулей отправки
             {  //первый элемент массива истории отправки по каналам 
                type: {
                    type: String,
                    default: "submission"
                }, //принято на отправку
                chan: {
                    type: String,
                    default: "smpp"
                }, //канал smpp-sms
                ts: {
                    type: Number,
                    default: 1507716066
                }, //время получения отчета от модуля
                result:{  
                   code: {
                    type: Number,
                    default: 0
                }, //успешно принято на отправку
                   text: {
                    type: String,
                    default: "OK"
                }
                },
                data:{  
                   outgoing_connection_id: {
                    type: Number,
                    default: 6
                }, //идентификатор канального соединения из БД
                   outgoing_connection_name: {
                    type: String,
                    default: "BMS_TEST"
                }, //имя соединения
                   provider_name: {
                    type: String,
                    default: "BMS"
                } //имя поставщика
                }
             }
          ]
       },
       result:{  
          "text": {
            type: String,
            default: "OK"
        },
          "code": {
            type: Number,
            default: 0
        }
       },
       ts: {
        type: Number,
        default: 1507716149
    }, //время формирование финального отчета
       type: {
        type: String,
        default: "delivery"
    } //сообщение доставлено платформой
    }
 })

 module.exports = mongoose.model('messages', messageSchema);
 