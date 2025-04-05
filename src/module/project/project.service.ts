import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma.services';
import { connect } from 'http2';

@Injectable()
export class ProjectService {

  constructor(private readonly prisma:PrismaService){}
  async create(createProjectDto: CreateProjectDto,req) {

   try {
    const{name,emoji,description,workspaceId}=createProjectDto
    // find the workspace  
    const workspace=await this.prisma.workspace.findFirst({
      where:{
        id:workspaceId,
        ownerId:req.user.sub
      }
    })
    if(!workspace){
      throw new NotFoundException("workspace not found")
    }
    // create project 
    const project =await this.prisma.project.create({
      data:{
        name,
        description,
        emoji,
        workspace:{
          connect:{
            id:workspace.id
          }
        },
        createdBy:{
          connect:{
            id:req.user.sub
          }
        }
      }
    })
    return {message:"project created successfully",
      project
    }
   } catch (error) {
    throw new InternalServerErrorException(error.message ||"something went wrong")
   }
  }



  // get all project 
  async findAllProjects(workspaceId,req) {
  try {
    const project =await this.prisma.project.findMany({
      where:{
        workspaceId,
        createdById:req.user.id
      }
    })
    if(project.length===0){
      throw new NotFoundException("no projects found ")
    }
    return project
  } catch (error) {
    throw new InternalServerErrorException(error.message ||"something went wrong")
  }
  }



 async findOne(workspaceId,projectId,req) {
    try {
      // find if workpsace exist 
      const workspace =await this.prisma.workspace.findFirst({
        where:{
          id:workspaceId,
          ownerId:req.user.sub
        }

      })
        if (!workspace) {
          throw new NotFoundException('workspace not found');
        }

      // find the project 
      const project =await this.prisma.project.findFirst({
        where:{
          id:projectId,
          workspaceId
        }
      })

       if (!project) {
         throw new NotFoundException('Project not found');
       }
     return project

    } catch (error) {
      throw new InternalServerErrorException(error.message ||"something went wrong")
    }
  }

  async updateProject(projectId,req, updateProjectDto: UpdateProjectDto) {
  try {
    const{name,emoji,description,workspaceId} =updateProjectDto
    // find if workpsace exist
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: req.user.sub,
      },
    });
    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }
    // update the project 
    const updateProject =await this.prisma.project.update({
      where:{
        id:projectId
      },
      data:{
        name,emoji,description,
        workspaceId:workspace.id
      }
    })
    return updateProject
  } catch (error) {
     console.error(error);
    throw new InternalServerErrorException(error.message ||"something went wrong")
  }
  }

 async removeProject(workspaceId,projectId,req) {
    try {
        const workspace = await this.prisma.workspace.findFirst({
          where: {
            id: workspaceId,
            ownerId: req.user.sub,
          },
        });
        if (!workspace) {
          throw new NotFoundException('workspace not found');
        }
        // delete the project  
        const project  =await this.prisma.project.delete({
          where:{
            id:projectId
          }
        })
        return {message:"project have been deleted"}
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error.message ||"something went wrong ")
    }
   
  }
}
