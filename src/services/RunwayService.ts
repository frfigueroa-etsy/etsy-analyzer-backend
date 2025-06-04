// services/RunwayService.ts
import RunwayML from '@runwayml/sdk';
import { envs } from '../configs/envs';

export class RunwayService {
   private client: InstanceType<typeof RunwayML>;

constructor() {
    this.client = new RunwayML({ apiKey: envs.RUNWAY_API_KEY });
  }


  /**
   * Crea un video a partir de una imagen con texto.
   */
  async createVideoFromImage({
    promptImage,
    promptText,
    ratio = '1280:720',
    duration = 5
  }: {
    promptImage: string;
    promptText: string;
    ratio?: '1280:720' | '720:1280';
    duration?: number;
  }) {
    const task = await this.client.imageToVideo.create({
      model: 'gen4_turbo',
      promptImage,
      promptText,
      ratio,
      duration
    });

    return task;
  }

  /**
   * Consulta el estado del video generado.
   */
  async checkVideoStatus(taskId: string) {
    const task = await this.client.tasks.retrieve(taskId);
    return task;
  }

  /**
   * Espera hasta que el video esté listo o falle.
   */
  async waitForCompletion(taskId: string, intervalMs = 10000) {
    let task;

    do {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      task = await this.checkVideoStatus(taskId);
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    return task;
  }

  public async generateImprovedImage(promptImage: string, promptText: string): Promise<string[]> {
  try {
    const imageTask = await this.client.imageToImage.create({
      model: 'image-to-image',
      promptImage, // URL de la imagen original
      promptText, // descripción del cambio o mejora
    });

    const taskId = imageTask.id;

    let task;
    do {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      task = await this.client.tasks.retrieve(taskId);
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    if (task.status === 'FAILED') throw new Error('Image generation failed');

    return task.output || [];
  } catch (error: any) {
    console.error('Runway image improvement error:', error.message);
    throw new Error('Failed to generate improved image');
  }
}
}
