import { HttpException, Injectable } from "@nestjs/common";
import { Dallor } from "./dallor.schema";
import {InjectModel, } from "@nestjs/mongoose"
import {DalloDocument} from "./dallor.schema"
import {Model} from "mongoose"
import * as moment from "moment-jalaali-es";
moment.loadPersian()
import { DallorDTO } from "./dallor.dto";
@Injectable()
export class AppService{
    constructor(
        @InjectModel(Dallor.name) private dallorModel : Model<DalloDocument>
    ){}
    async savePrice(dallorDto : DallorDTO){
        try {
            const date = moment().format("jYYYYjMMjDD")
            const time = moment().format("HHmm")
            const existRecord = await this.dallorModel.findOne({"values.date" : date, "values.time" : time});
            const existRecordDallor = await this.dallorModel.findOne({});
        if(existRecord){
            await this.dallorModel.updateOne({_id : existRecord._id, "values.date" : date, "values.time" : time}, {
                $set : {"values.$.price" : dallorDto.price, "values.$.time" : time}
            })
        }else if(existRecordDallor){
            await this.dallorModel.updateOne({_id : existRecordDallor._id}, {
                $push : { values : dallorDto}
            })
        }else{
            await this.dallorModel.create({
                title : "dallor",
                values : [dallorDto]
            })
        }
        } catch (error:any) {
            throw new HttpException(error?.message || "", error.status || 400)
        }
    }
    async findPrice(){
        const dallor = await (await this.dallorModel.aggregate([{$match : {}}]));
        let latestPrice = [];
        for (const item of dallor) {
            item.values = item.values.slice(-30)
            latestPrice = item.values.map( v => v.price)
        }
        const increases = latestPrice.map((currVal, index) => {
            if (index === 0) return;
            const prevVal = latestPrice[index - 1];
            return ((currVal - prevVal) / prevVal) * 100;
        }).filter(Boolean);
        for (const item of dallor) {
            item.values = item.values.map((value, index) => {
                value.diff = increases[index]
                return value
            })
        }
        return {
            dallor ,
            diff : increases,
            avg : (latestPrice.reduce((p , c) => p+c, 0) / latestPrice.length).toFixed(3),
            count : latestPrice.length,
        }
    }
}