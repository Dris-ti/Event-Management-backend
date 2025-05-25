import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EVENT } from 'src/db/entities/event.entity';
import { USER } from 'src/db/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { EventDto } from './dtos/event.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(EVENT)
        private event_Repo: Repository<EVENT>,

        @InjectRepository(USER)
        private user_Repo: Repository<USER>,
    ){}

    async checkAdmin(req) {
        const userEmail = req.user.email;
        const user = await this.user_Repo.findOne({where: {email: userEmail}});

        console.log("user", user);

        if (user?.user_type != 'admin') {
          return false;
        } else {
          return true;
        }
}

    async showallEvents(req, res) {
      const admin = await this.checkAdmin(req);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access.',
        });
      }
      const events = await this.event_Repo.find();

      return res.status(200).json({
        message: 'All Events Fetched Successfully.',
        success: true,
        data: events.length > 0 ? events : 'No Events Found',
      });
    }

    async createEvent(data : EventDto, req, res) {
      const admin = await this.checkAdmin(req);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access.',
        });
      }
      if (typeof data.tag === 'string') {
        data.tag = data.tag
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
      }

      // Type-cast the DTO to match EVENT entity
      const newEvent = this.event_Repo.create(data as unknown as DeepPartial<EVENT>);

      await this.event_Repo.save(newEvent);

      return res.status(201).json({
        message: 'Event Created Successfully.',
        success: true,
        data: newEvent,
      });
    }

    async editEvent(data : EventDto, id, req, res) {
      const admin = await this.checkAdmin(req);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access.',
        });
      }

      const event = await this.event_Repo.findOne({where: {id: id}});

      if (!event) {
        return res.status(404).json({
          message: 'Event Not Found.',
          success: false,
        });
      }
      await this.event_Repo.update(id, data as unknown as DeepPartial<EVENT>);

      return res.status(200).json({
        message: 'Event Updated Successfully.',
        success: true,
        data: data,
      });
    }

    async showEvent(id, req, res) {
      const admin = await this.checkAdmin(req);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access.',
        });
      }

      const event = await this.event_Repo.findOne({where: {id: id}});

      if (!event) {
        return res.status(404).json({
          message: 'Event Not Found.',
          success: false,
        });
      }

      return res.status(200).json({
        message: 'Event Fetched Successfully.',
        success: true,
        data: event,
      });
    }


    async deleteEvent(id, req, res) {
      const admin = await this.checkAdmin(req);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access.',
        });
      }

      const event = await this.event_Repo.findOne({where: {id: id}});

      if (!event) {
        return res.status(404).json({
          message: 'Event Not Found.',
          success: false,
        });
      }
      await this.event_Repo.delete(id);

      return res.status(200).json({
        message: 'Event Deleted Successfully.',
        success: true,
      });
    }
}
