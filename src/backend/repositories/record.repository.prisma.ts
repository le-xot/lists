import { Injectable } from '@nestjs/common';
import { RecordRepository } from './record.repository';
import { PrismaService } from '../db/prisma.service';
import { RecordEntity } from './record.entity';
import { Record } from '@prisma/client';
import { Genres, Grades, Statuses } from './record.entity.enums';

@Injectable()
export class RecordRepositoryPrisma implements RecordRepository {
  constructor(private prisma: PrismaService) {}

  private convertRecord(record: Record): RecordEntity {
    return {
      ...record,
      status: Statuses[record.status],
      genre: Genres[record.genre],
      grade: Grades[record.grade],
    };
  }

  async createRecord(record: Omit<RecordEntity, 'id'>): Promise<RecordEntity> {
    const newRecord = await this.prisma.record.create({
      data: record,
    });
    return this.convertRecord(newRecord);
  }

  async getAllRecords(): Promise<RecordEntity[]> {
    const records = await this.prisma.record.findMany();
    return records.map((record) => this.convertRecord(record));
  }

  async deleteRecord(id: number): Promise<void> {
    await this.prisma.record.delete({ where: { id } });
  }
}
