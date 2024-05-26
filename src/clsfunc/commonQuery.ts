import {
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  Repository,
} from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';

export class commonQuery {
  static async UpdateGuard(
    userRepository: Repository<UserEntity>,
    id: string,
    activate: string,
    guard: number,
  ): Promise<boolean> {
    try {
      const result = await userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ guard: guard, activate: activate })
        .where({ id: id })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log('UpdateLogin : ' + E);
      return false;
    }
  }
}
