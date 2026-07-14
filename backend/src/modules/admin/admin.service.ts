import { IAdminRepository } from "./admin.interface.js";

export class AdminService{
    constructor(private adminRepo:IAdminRepository){}
    async getAllUser(){
        const user=await this.adminRepo.getAllUsers()
        return user
    }
}