<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Vehicule;
use App\Repository\VehiculeRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class VehiculeChronoSubscriber implements EventSubscriberInterface
{
    /**
     * @var Security
     */
    private $security;

    /**
     * @var VehiculeRepository
     */
    private $repository;

    public function __construct(Security $security, VehiculeRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForVehicule', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForVehicule(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Vehicule && $method == "POST") {
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $result->setChrono($nextChrono);
        }
    }
}