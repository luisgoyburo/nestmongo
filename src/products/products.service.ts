import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import {Model } from 'mongoose';
import {Product} from './entities/product.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
 
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {

  }
  async create(createProductDto: CreateProductDto) {
    const newProduct = new this.productModel({
      title: createProductDto.title,
      description: createProductDto.description,
      price: createProductDto.price,
    });
    const result = await newProduct.save();
    console.log(result);
    return result._id;
    
  }

  async findAll() {
    const products = await this.productModel.find();
    console.log(products);
    //return products;
    // We could map to change the field names that is returned by mongoose
    return products.map((prod) =>({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async findOne(id: string) {
    const myproduct = await this.findId(id);
    console.log(myproduct)
    return {
      id: myproduct.id,
      title: myproduct.title,
      description: myproduct.description,
      price: myproduct.price,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updateProduct = await this.findId(id);
    if( updateProductDto.title){
      updateProduct.title = updateProductDto.title;
    }
    if( updateProductDto.description){
      updateProduct.description = updateProductDto.description;
    }
    if( updateProductDto.price){
      updateProduct.price = updateProductDto.price;
    }
    updateProduct.save()
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    //await this.productModel.deleteOne({id: id}); THIS DELETE THE FIRST PRODUCT ALWAYS
    const resultDelete = await  this.productModel.findByIdAndDelete(id);
    return `This action removes a #${id} product`;
  }

  private async findId(id: string){
    let myproduct;
    try {
      myproduct = await this.productModel.findById(id)
    } catch (error){
      throw new NotFoundException('Could not find product')
    }    
    if(!myproduct){
      throw new NotFoundException('Could not find product')
    }
    console.log(myproduct)
    return myproduct;
  }
}
