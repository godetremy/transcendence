import { UseMutationOptions } from '@tanstack/react-query';
import { User } from '@/types/User';
import { UserUpdateParameters } from '@/types/UserUpdateParameters';
import { patch } from '@/lib/fetcher';
import { GlobalQueryClient } from '@/lib/fetcher/queryClient';

const updateUser = (user_id: string): UseMutationOptions<User, Error, { user: UserUpdateParameters }, User> => ({
	mutationKey: ['user', 'update'],
	mutationFn: ({ user }) => patch<User>(`/users/${user_id}`, user),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['user', 'mine'] });
	},
});

export { updateUser };
