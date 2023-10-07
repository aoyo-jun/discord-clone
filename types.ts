import { Member, Profile, Server } from "@prisma/client"

// Creates a new type based on the Server one, adding Members and Profiles
export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
};