import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { toast } from 'sonner';

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      price: bigint;
      currency: string;
      category: string;
      imageUrl: string;
      rating: bigint | null;
      stock: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(
        params.title,
        params.description,
        params.price,
        params.currency,
        params.category,
        params.imageUrl,
        params.rating,
        params.stock
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add product');
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      productId: bigint;
      title: string;
      description: string;
      price: bigint;
      currency: string;
      category: string;
      imageUrl: string;
      rating: bigint | null;
      stock: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(
        params.productId,
        params.title,
        params.description,
        params.price,
        params.currency,
        params.category,
        params.imageUrl,
        params.rating,
        params.stock
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast.success('Product updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

export function useUpdateStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, stock }: { productId: bigint; stock: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStock(productId, stock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast.success('Stock updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update stock');
    },
  });
}
