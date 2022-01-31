import { Field, ObjectType, Int } from "@nestjs/graphql";
import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";

interface ValuesArray {
    date : String;
    price : Number;
    time : String;
}
@ObjectType()
@Schema()
export class Dallor{
    @Field(type => [Object])
    @Prop()
    values : ValuesArray[];
    @Field(type => String, {nullable : true})
    @Prop({default : "dallor"})
    title : String
}
export type DalloDocument = Dallor & Document;
export const DallorSchema = SchemaFactory.createForClass(Dallor)