import { ArgsType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { MedicalDegreeOutput } from "./get-degrees.dto";

@ArgsType()
export class AddMedicalDegreeArgs{
    @IsNotEmpty()
    @IsString()
    name:string;
}

@ObjectType()
export class AddMedicalDegreeOutput{
    savedDegree:MedicalDegreeOutput
}