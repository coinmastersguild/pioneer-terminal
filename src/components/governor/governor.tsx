'use client';

import {
  fetchProposals,
  Proposal,
  ProposalWithThumbnail,
} from '@/app/services/proposal';
import { BASE_DAO_ADDRESSES } from '@/utils/constants';
import { Box, Grid, GridItem, Heading, HStack, Tabs } from '@chakra-ui/react';
import ProposalListCard from '../proposal/listCard';
import { LuLayoutGrid, LuList } from 'react-icons/lu';
import ProposalGridCard from '../proposal/gridCard';
import { useEffect, useState } from 'react';
import { useDaoAddress } from '@/providers/daoAddress';
import { useChainId } from 'wagmi';

function GovernorClient({
  defaultProposals,
}: {
  defaultProposals: ProposalWithThumbnail[];
}) {
  const [proposals, setProposals] =
    useState<ProposalWithThumbnail[]>(defaultProposals);
  const daoAddress = useDaoAddress();
  const chainId = useChainId();

  useEffect(() => {
    async function getProposals() {
      const fetchedProposals = await fetchProposals(
        daoAddress.DAO_ADDRESSES.token,
        'proposalNumber',
        'desc',
        1000,
        {},
        false,
        true,
        chainId
      );
      setProposals(fetchedProposals);
    }

    if (defaultProposals.length === 0) {
      getProposals();
    }
  }, [daoAddress]);

  return (
    <Box
      shadow={'sm'}
      w={'full'}
      padding={4}
      rounded={'md'}
      _dark={{ borderColor: 'green', borderWidth: 1 }}
      display={'flex'}
      flexDirection={'column'}
      gap={2}
    >
      <Tabs.Root defaultValue='list' variant={'subtle'} size={'sm'}>
        <HStack justify={'space-between'}>
          <Heading as='h2'>Proposals</Heading>
          <Tabs.List>
            <Tabs.Trigger value='grid'>
              <LuLayoutGrid />
            </Tabs.Trigger>
            <Tabs.Trigger value='list'>
              <LuList />
            </Tabs.Trigger>
          </Tabs.List>
        </HStack>
        <Tabs.Content value='grid'>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={2}>
            {proposals.map((proposal: Proposal) => (
              <GridItem key={proposal.proposalId}>
                <ProposalGridCard proposal={proposal} />
              </GridItem>
            ))}
          </Grid>
        </Tabs.Content>
        <Tabs.Content value='list'>
          {proposals.map((proposal: Proposal) => (
            <ProposalListCard key={proposal.proposalId} proposal={proposal} />
          ))}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}

export default GovernorClient;
