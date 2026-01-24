import {
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { envs } from '../config';
import { PaginationDto } from 'src/common';
import { Prisma, PrismaClient } from 'src/generated/prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: envs.databaseUrl });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    if (!page || !limit) {
      return this.product.findMany();
    }

    const totalPage = await this.product.count({where: { available: true}});

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true
        }
      }),
      meta: {
        totalItems: totalPage,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalPage / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({ where: { id, available: true } });

    if (!product) {
      throw new RpcException({
        message: `Product with id: ${id} not found`,
        status: HttpStatus.BAD_REQUEST
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    try {

      const {id: __, ...data} = updateProductDto;

      return await this.product.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new RpcException({
          message: `Product with id ${id} not found`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      const product = await this.product.update({
        where: { id },
        data: {
          available: false
        }
      });

      return product;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new RpcException({
          message: `Product with id ${id} not found`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      throw error;
    }
  }
}
