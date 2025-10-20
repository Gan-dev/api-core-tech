import { Body, Controller, Param, Post } from '@nestjs/common';
import { Client } from './entities/client.entity';
import type { ClientPrimitiveData } from './entities/client.entity';

@Controller('clients')
export class ClientsController {
    // Controller methods will go here
    @Post()
    async createClient(
        @Body() client: ClientPrimitiveData): Promise<Client> {
        const newClient = Client.create(client.name, client.lastName);
        console.log('Client created:', newClient.toPrimitive());
        return newClient;
    }

    getClient(id: string): Client | undefined {
        return //Client.findById(id);
    }

    updateClient(id: string, client: ClientPrimitiveData): Client | undefined {
        // const existingClient = Client.findById(id);
        // if (existingClient) {
        //     existingClient.update(client);
        //     return existingClient;
        // }
        return undefined;
    }

    deleteClient(id: string): boolean {
        // const existingClient = Client.findById(id);
        // if (existingClient) {
        //     Client.delete(existingClient);
        //     return true;
        // }
        return false;
    }
}
