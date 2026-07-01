import {
	InfiniteData,
	QueryKey,
	UseInfiniteQueryOptions,
	UseMutationOptions,
	UseQueryOptions,
} from '@tanstack/react-query';
import { User } from '@/types/User';
import { UserUpdateParameters } from '@/types/UserUpdateParameters';
import { get, patch, post } from '@/lib/fetcher';
import { GlobalQueryClient } from '@/lib/fetcher/queryClient';
import { SumupCreateCheckouts } from '@/types/SumupCreateCheckouts';
import { BalanceType } from '@/types/Balance';
import { PaginationResponse } from '@/types/PaginationResponse';
import { TranscationType } from '@/types/Transaction';

const updateUser = (user_id: string): UseMutationOptions<User, Error, { user: UserUpdateParameters }, User> => ({
	mutationKey: ['user', 'update'],
	mutationFn: ({ user }) => patch<User>(`/users/${user_id}`, user),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['user', 'mine'] });
	},
});

const updateBalance = (
	user_id: string
): UseMutationOptions<
	{ success: boolean; redirect_url: string },
	Error,
	{ checkout: SumupCreateCheckouts },
	SumupCreateCheckouts
> => ({
	mutationKey: ['user', 'balance', 'update'],
	mutationFn: ({ checkout }) =>
		post<{ success: boolean; redirect_url: string }>(`/users/${user_id}/balance`, checkout),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['user', 'balance'] });
	},
});

const getBalance = (user_id: string): UseQueryOptions<BalanceType, Error> => ({
	queryFn: () => get<BalanceType>(`/users/${user_id}/balance`),
	queryKey: ['user', user_id, 'balance'],
});

const getTransactions = (
	user_id: string,
	balance_id: string
): UseInfiniteQueryOptions<
	PaginationResponse<TranscationType>,
	Error,
	InfiniteData<PaginationResponse<TranscationType>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam }) =>
		get<PaginationResponse<TranscationType>>(`/users/${user_id}/balance/${balance_id}?page=${pageParam}`),
	queryKey: ['user', 'balance'],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

export { updateUser, updateBalance, getBalance, getTransactions };
