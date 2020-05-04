<?php

namespace App\DataFixtures;

use App\Entity\Invoice;
use App\Entity\Maintenance;
use App\Entity\User;
use App\Entity\Vehicule;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr-FR');

        for($c = 0; $c < 30; $c++) {
            $user = new User();

            $chrono_vehicules = 1;

            $hash = $this->encoder->encodePassword($user, 'password');

            $user->setLastname($faker->lastName)
                ->setFirstname($faker->firstName)
                ->setEmail($faker->email)
                ->setPassword($hash);

            $manager->persist($user);

            for($v = 0; $v < mt_rand(1, 3); $v++) {
                $vehicule = new Vehicule();

                $chrono_maintenances = 1;

                $vehicule->setType($faker->randomElement(['Voiture', 'Moto', 'Scooter']))
                    ->setIdentification($faker->creditCardNumber)
                    ->setBrand($faker->name)
                    ->setReference($faker->name)
                    ->setModelyear($faker->dateTimeBetween('-2 years', '+2 years'))
                    ->setUser($user)
                    ->setChrono($chrono_vehicules);

                $chrono_vehicules++;

                $manager->persist($vehicule);

                for($m = 0; $m < mt_rand(1, 10); $m++) {
                    $maintenance = new Maintenance();

                    $chrono_invoices = 1;

                    $maintenance->setType($faker->randomElement(['Réparation', 'Entretien', 'Restauration']))
                        ->setDate($faker->dateTimeBetween('-2 years', '+2 years'))
                        ->setAmount($faker->randomFloat(2, 10, 2500))
                        ->setVehicule($vehicule)
                        ->setChrono($chrono_maintenances);

                    $chrono_maintenances++;

                    $manager->persist($maintenance);

                    for($i = 0; $i < mt_rand(1 , 3); $i++) {
                        $invoice = new Invoice();
                        $invoice->setFilename($faker->text)
                            ->setMaintenance($maintenance)
                            ->setChrono($chrono_invoices);

                        $chrono_invoices++;

                        $manager->persist($invoice);
                    }
                }
            }
        }

        $manager->flush();
    }
}
