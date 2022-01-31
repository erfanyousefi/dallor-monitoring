import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
@Injectable()
export class DallorAPI{
    constructor(
        private httpService : HttpService
    ){}
    async getPrice(){

    }
}