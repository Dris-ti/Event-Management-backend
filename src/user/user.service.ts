import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BOOKING } from 'src/db/entities/booking.entity';
import { EVENT } from 'src/db/entities/event.entity';
import { USER } from 'src/db/entities/user.entity';
import { LessThan, Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(EVENT)
    private event_Repo: Repository<EVENT>,

    @InjectRepository(USER)
    private user_Repo: Repository<USER>,

    @InjectRepository(BOOKING)
    private booking_Repo: Repository<BOOKING>,
  ) {}

  async futureEvents(req, res) {
    const events = await this.event_Repo.find({
      where: { date: MoreThanOrEqual(new Date().toISOString()) },
    });

    return res.status(200).json({
      message: 'All Future Events Fetched Successfully.',
      success: true,
      data: events,
    });
  }

  async pastEvents(req, res) {
    const events = await this.event_Repo.find({
      where: { date: LessThan(new Date().toISOString()) },
    });

    return res.status(200).json({
      message: 'All Past Events Fetched Successfully.',
      success: true,
      data: events,
    });
  }

  async showEvent(id, req, res) {
    const event = await this.event_Repo.findOne({
      where: { id: id },
    });

    if (!event) {
      return res.status(404).json({
        message: 'Event not found.',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Event Fetched Successfully.',
      success: true,
      data: event,
    });
  }

  async eventSearch(res, query: string) {
    const searchQuery = `%${query.toLowerCase()}%`;

    const events = await this.event_Repo
      .createQueryBuilder('event')
      .where('LOWER(event.title) LIKE :search', { search: searchQuery })
      .orWhere('LOWER(event.description) LIKE :search', { search: searchQuery })
      .orWhere('LOWER(event.location) LIKE :search', { search: searchQuery })
      .getMany();

    return res.status(200).json({
      message: 'Event Search Results Fetched Successfully.',
      success: true,
      data: events.length > 0 ? events : 'No Events Found',
    });
  }

  async eventBooking(req, res, id, seat) {
  const event = await this.event_Repo.findOne({ where: { id } });

  if (!event) {
    return res.status(404).json({
      message: 'Event not found.',
      success: false,
    });
  }

  // Fetch the full user entity
  const user = await this.user_Repo.findOne({ where: { id: req.user.id } });

  if (!user) {
    return res.status(404).json({
      message: 'User not found.',
      success: false,
    });
  }

  if (seat.seat < 1 || seat.seat > 4) {
    return res.status(400).json({
      message: 'You can book between 1 to 4 seats only.',
      success: false,
    });
  }

  if (event.available_seats < seat.seat) {
    return res.status(400).json({
      message: 'Not enough seats available.',
      success: false,
    });
  }

  // Update event's available seats
  event.available_seats -= seat.seat;
  await this.event_Repo.update(event.id, { available_seats: event.available_seats });

  // Save the booking
  const booking = new BOOKING();
  booking.user_id = user;
  booking.event_id = event;
  booking.seats_booked = seat.seat;
  booking.booked_at = new Date();

  await this.booking_Repo.save(booking);

  return res.status(200).json({
    message: 'Booking successful.',
    success: true,
    data: {
      eventId: event.id,
      bookedSeats: seat.seat,
    },
  });
}

async bookingHistory(req, res) {
  const userId = req.user.id;

  const bookings = await this.booking_Repo.find({
    where: { user_id: { id: userId } },
    relations: ['event_id'], 
    order: { booked_at: 'DESC' },
  });

  if (!bookings || bookings.length === 0) {
    return res.status(404).json({
      message: 'No past bookings.',
      success: false,
    });
  }

  return res.status(200).json({
    message: 'Booking history fetched successfully.',
    success: true,
    data: bookings
  });
}

async cancelBooking(id, req, res) {
  const bookingId = id;

  const booking = await this.booking_Repo.findOne({
    where: { id: bookingId, user_id: req.user.id },
    relations: ['event_id'],
  });

  if (!booking) {
    return res.status(404).json({
      message: 'Booking not found.',
      success: false,
    });
  }

  // Convert string date to Date object
  const eventDate = new Date(booking.event_id.date);
  const cancellationDeadline = new Date(eventDate.getTime() - 48 * 60 * 60 * 1000);
  const now = new Date();

  console.log("Event Date:", eventDate);
  console.log("Cancellation Deadline:", cancellationDeadline);
  console.log("Now:", now);

  if (now > cancellationDeadline) {
    return res.status(403).json({
      message: 'Booking can not be cancelled 48 hours before the event.',
      success: false,
    });
  }

  // Update available seats
  const event = booking.event_id;
  event.available_seats += booking.seats_booked;
  await this.event_Repo.update(event.id, { available_seats: event.available_seats });

  // Delete the booking
  await this.booking_Repo.delete(booking.id);

  return res.status(200).json({
    message: 'Booking cancelled successfully.',
    success: true,
    data: {
      eventId: event.id,
      cancelledSeats: booking.seats_booked,
    },
  });
}
}
