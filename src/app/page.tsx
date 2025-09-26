
import Link from 'next/link';
import Image from 'next/image';
import { subjects } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Translate } from '@/components/Translate';

export default function SubjectSelectionPage() {
  return (
    <>
      <PageHeader title="Choose a Subject" />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const placeholder = PlaceHolderImages.find(p => p.id === subject.imageId);
            return (
              <Link href={`/subjects/${subject.id}`} key={subject.id}>
                <Card className="h-full overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                   <CardContent className="p-0">
                    {placeholder && (
                       <Image
                        src={placeholder.imageUrl}
                        alt={subject.name}
                        width={600}
                        height={400}
                        data-ai-hint={placeholder.imageHint}
                        className="rounded-t-lg object-cover aspect-[3/2]"
                      />
                    )}
                  </CardContent>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                      <subject.icon className="w-6 h-6 text-primary" />
                      <Translate>{subject.name}</Translate>
                    </CardTitle>
                    <CardDescription><Translate>{subject.description}</Translate></CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  );
}
