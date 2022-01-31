import {Controller, Get, Query } from "@nestjs/common";
import {HttpService} from "@nestjs/axios"
import { map } from "rxjs";
import { AppService } from "./app.service";
import * as moment from "moment-jalaali-es";
import { Dallor } from "./dallor.schema";
moment.loadPersian()
@Controller()
export class AppController{
    constructor(
        private httpService : HttpService,
        private appService : AppService
        ){}
        @Get("/dallor")
        async findPrice(){
        const data:any = await this.httpService.get("http://api.navasan.tech/latest/?api_key=freeKqoSBZpsgD2bKK1LuDNIendxwO5s").pipe(
            map(response => response.data.usd_sell));
        const dallorData = {
            date : moment().format("jYYYYjMMjDD"),
            price : data.value || (Math.floor(Math.random() * 100000) + 200000),
            time : moment().format("HHmm")
        }
        await this.appService.savePrice(dallorData)
        return await this.appService.findPrice();
    }

}